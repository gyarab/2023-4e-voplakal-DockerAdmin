const { appsData, instances } = require("../models/fixtures");
const Instance = require("../models/instance.model");
const docker = require("../docker/docker");
const User = require("../models/user.model");
const { App } = require("../models");
const assert = require("node:assert");
const email = require("../email");

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
            let ins = await Instance.find({client: req.user._id}).populate("client", "email").lean({ virtuals: true, getters: true, setters: true });
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
        let containers = instances.map((i) => i.container_id);
        await docker.rm(...containers);
        await Instance.deleteMany({
            _id: { $in: req.body.ids },
        });
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
        res.send({});
    },
    stop: async (req, res) => {
        let containerIds = req.body.ids;
        console.log("stop:", containerIds);
        await docker.stop(...containerIds);
        res.send({});
    },
    create: async (req, res) => {
        let { app_id, client_email, instance_name, form_data } = req.body;
        // console.log("create:", app_id, client_email, instance_name, formData);

        let client = await User.findOne({ email: client_email });
        if (!client) client = await User.create({ email: client_email });
        let app = await App.findById(app_id);

        let instance = new Instance({
            app_id,
            image_id: app.selected_image_id,
            name: instance_name,
            client: client._id,
            form_data,
            mount_folder:
                String(instance_name)
                    .toLowerCase()
                    .replace(/\\|:|\/|"|\*|\s|\||\?/g, "-") + "_mount",
        });
        instance.validateSync();

        let init = await docker.init(instance);
        console.log(init);
        //spustit
        let container_id = await docker.run(instance);
        console.log("container id:", container_id);
        instance.container_id = container_id;

        console.log("instance limits:", instance.limits);
        await docker.setLimits(container_id, instance.limits);

        //uložit pokud běží ok
        await instance.save();
        if (process.env.EMAIL === "ON") {
            await email.send({
                to: client_email,
                subject: "Vaše instance aplikace " + app.name,
                text: "Vaše instance " + instance_name + " aplikace " + app.name + " byla vytvořena. \n použili jste tyto init data:\n" + JSON.stringify(form_data, null, 2),
            });
        }
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
