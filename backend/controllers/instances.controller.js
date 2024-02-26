var net = require("net");
const { appsData, instances } = require("../models/fixtures");
const Instance = require("../models/instance.model");
const docker = require("../docker/docker");
const User = require("../models/user.model");
const { App } = require("../models");
const assert = require("node:assert");
const email = require("../email");
const caddy = require("../caddy");
const fs = require("fs");
const path = require("path");
const { verifyRecaptcha } = require("../captcha");

module.exports = {
    getAll: async (req, res) => {
        if (req.user.roles.includes("ADMIN")) {
            let ins = await Instance.find().populate("client", "email").lean({ virtuals: true, getters: true, setters: true });
            if (!ins) ins = [];
            let ps = await docker.ps();
            let images = await docker.getImages();
            // console.log("ps: ", ps);
            // console.log("images: ", images);
            for (const i of ins) {
                let d = ps.find((c) => c.ID === i.container_id);
                let f = images.find((im) => im.ID === i.image_id);
                // if (!d || !f) {
                //     if (process.env.NODE_ENV === "production") console.log("Not found matching image or container");
                //     else throw "Not found matching image or container. Try to delete DB";
                // }
                i.container = d;
                i.image = f;
            }
            res.send(ins);
        } else if (req.user.roles.includes("USER")) {
            let ins = await Instance.find({ client: req.user._id }).populate("client", "email").lean({ virtuals: true, getters: true, setters: true });
            if (!ins) ins = [];
            // let ps = await docker.ps(); // todo cache
            // let images = await docker.getImages(); // todo cache
            res.send(ins);
        } else {
            res.status(401).send();
        }
    },
    delete: async (req, res) => {
        console.log("delete:", req.body.ids);
        let instances = await Instance.find({
            _id: { $in: req.body.ids },
        });
        for (const instance of instances) {
            let app = await App.findById(instance.app_id);
            await docker.rm(instance.container_id);
            await docker.runScript(instance, app.remove_code);
            fs.rmSync(path.join(global.APPS_DATA_PATH, instance.mount_folder), { recursive: true, force: true });
            caddy.deleteRoute(instance.container_id).catch(() => {});
            await Instance.findByIdAndDelete(instance._id);
        }
        res.send({});
    },

    upgrade: async (req, res) => {
        console.log("upgrade:", req.body.ids, req.body.imageId);
        assert.ok(req.body.ids && req.body.imageId, "Invalid request, missing props: imageId or ids");
        let instances = await Instance.find({
            _id: { $in: req.body.ids },
        });
        for (const instance of instances) {
            await docker.rm(instance.container_id);
            console.log("před: ", instance.image_id);
            instance.image_id = req.body.imageId;
            console.log("po: ", instance.image_id);

            // let dir = path.join(global.APPS_DATA_PATH, instanceMount);
            // fs.copyFileSync(path.join(global.APPS_DATA_PATH, appMount, "DEFAULT", ".env"), dir);

            // fs.cpSync(path.join(global.APPS_DATA_PATH, appMount, "DEFAULT"), dir, { recursive: true });

            let newContainerID = await docker.run(instance);
            if (!newContainerID) throw "No new container ID provided";
            instance.container_id = newContainerID;
            await instance.save();
        }
        res.send({});
    },
    save: async (req, res) => {
        let instance = req.body;
        // console.log("save:", instance);
        let updated = await Instance.findByIdAndUpdate(req.body._id, req.body);
        if (!updated) return res.status(404).send({});
        res.send({});
    },
    start: async (req, res) => {
        let containerId = req.body.id;
        console.log("start:", containerId);
        await docker.start([containerId]);
        let instance = await Instance.findOne({ container_id: containerId });
        let app = await App.findById(instance.app_id);
        if (app.domain) await caddy.addRoute(instance.container_id, `${instance.name}.${app.domain}`, instance.port);
        res.send({});
    },
    stop: async (req, res) => {
        let containerIds = req.body.ids;
        console.log("stop:", containerIds);
        await docker.stop(...containerIds);
        for (const id of containerIds) {
            caddy.deleteRoute(id).catch(() => {});
        }
        res.send({});
    },
    create: async (req, res) => {
        let { app_id, client_email = "", instance_name = "", form_data = {} } = req.body;
        await verifyRecaptcha(form_data.captcha);
        if ((await Instance.countDocuments({})) >= global.instancesCountLimit) return res.status(503).send({ message: "Server is currently out of instance limit. Please contact us on email: martin.air@seznam.cz and we will make this service available again." });
        client_email = ss(client_email);
        instance_name = ss(instance_name);
        let forbidenNames = process.env.FORBIDEN_INSTANCE_NAMES.split(";");
        if (forbidenNames.some((n) => instance_name.includes(n))) return res.status(400).send({ message: "Try another instance name" });
        for (const key in form_data) {
            if (Object.hasOwnProperty.call(form_data, key)) {
                form_data[key] = ss(form_data[key]);
            }
        }

        // console.log("create:", app_id, client_email, instance_name, formData);

        console.log("create");
        let client = await User.findOne({ email: client_email });
        if (!client) client = await User.create({ email: client_email });
        let app = await App.findById(app_id);
        let instance = new Instance({
            app_id,
            image_id: app.selected_image_id,
            name: instance_name,
            client: client._id,
            form_data,
            port: await getFreePort(),
            expiry_date: Date.now() + app.free_days * 24 * 60 * 60 * 1000,
            mount_folder: path.join(
                app.folder,
                String(instance_name)
                    .toLowerCase()
                    .replace(/\\|:|\/|"|\*|\s|\||\?/g, "-") + "_mount"
            ),
        });
        instance.container_id = "placeholder"
        await instance.validateSync();
        await instance.save();
        copyDefaultFolder(app.folder, instance.mount_folder);
        let init = await docker.init(instance);
        console.log(init);
        //spustit
        let container_id = await docker.run(instance);
        console.log("container id:", container_id);
        instance.container_id = container_id;
        
        console.log("instance limits:", instance.limits);
        await docker.setLimits(container_id, instance.limits);
        
        console.log(instance._id);
        
        if (app.domain) await caddy.addRoute(instance.container_id, `${instance.name}.${app.domain}`, instance.port);
        console.log(instance._id);
        
        await instance.save();

        await email.send({
            to: client_email,
            subject: "Vaše instance aplikace " + app.name,
            text: `Vaše instance ${instance_name} aplikace ${app.name} byla vytvořena. \n ${app.domain ? `Je dostupná na https://${instance.name}.${app.domain}` : ""}`,
        });

        res.send({});
    },
    getStats: async (req, res) => {
        let id = req.query.id;
        // console.log("getStats:", id);
        let stats = (await docker.ps(id))[0];
        res.send(stats);
        // await Instance.create(instance)
        // let stats = await res.send({
        //     BlockIO: "108MB / 59.4MB",
        //     CPUPerc: "0.00%",
        //     Container: "a85f49b55397",
        //     ID: "a85f49b55397",
        //     MemPerc: "4.43%",
        //     MemUsage: "87.75MiB / 1.936GiB",
        //     Name: "m-test1",
        //     NetIO: "2.44GB / 510MB",
        //     PIDs: "24",
        // });
    },
};

async function getFreePort() {
    console.log("get free port");
    let instances = await Instance.find({}, "port");
    for (let i = global.PORT_RANGE.start; i < global.PORT_RANGE.end; i++) {
        if (instances.some((instance) => instance.port === i)) {
            console.log("continue");
            continue;
        }
        //check if is really free
        let confirmed = false;
        await new Promise(async (resolve, reject) => {
            let server = net.createServer();
            console.log("create server");
            server.once("error", function (err) {
                console.log("error");
                if (err.code === "EADDRINUSE") {
                    console.error("Unexpectedly address in use: " + i);
                    return resolve();
                }
                throw "Unexpected error when findig free port: " + err;
            });

            server.once("listening", function () {
                // close the server if listening doesn't fail
                server.close();
                confirmed = true;
                resolve();
            });
            server.listen(i);
        });

        if (!confirmed) continue;
        console.log("found " + i);
        return i;
    }
}
/**
 * Secure Sctring
 * replace all characters except numbers, letters, @-_with _
 * @param {String} string
 */
function ss(string) {
    return string.replace(/[^0-9a-zA-Z,.@-_]+/g, "-");
}

function copyDefaultFolder(appMount, instanceMount) {
    let dir = path.join(global.APPS_DATA_PATH, instanceMount);
    fs.cpSync(path.join(global.APPS_DATA_PATH, appMount, "DEFAULT"), dir, { recursive: true });
}
