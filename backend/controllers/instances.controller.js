const { appsData, instances } = require("../models/fixtures");
const Instance = require("../models/instance.model");
const docker = require("../docker/docker");
const User = require("../models/user.model");
const { App } = require("../models");

module.exports = {
    getAll: async (req, res) => {
        let ins = await Instance.find();
        if (!ins) ins = [];
        //todo load from docker ps stats and add
        // let ps = await docker.ps();
        // console.log(ps);
        // for (const i of ins) {
        //     let d = ps.find(c => c.ID === i.container_id);
        //     if(!d) continue;
        //     Object.assign(i, d);
        // }

        res.send(ins);
    },
    delete: async (req, res) => {
        console.log("delete:", req.body.ids);
        await Instance.deleteMany({
            _id: { $in: req.body.ids },
        });
        res.send({});
    },

    upgrade: async (req, res) => {
        console.log("upgrade:", req.body.ids, req.body.tag);
        res.send({});
    },
    save: async (req, res) => {
        let instance = req.body;
        console.log("save:", instance);
        let updated = await Instance.findByIdAndUpdate(req.body._id, req.body);
        if (!updated) return res.status(404).send({});
        res.send({});
    },
    start: async (req, res) => {
        let instanceId = req.body.id;
        console.log("start:", instanceId);
        res.send({});
    },
    create: async (req, res) => {
        let { app_id, client_email, instance_name, formData } = req.body;
        console.log("create:", app_id, client_email, instance_name, formData);

        let client = await User.findOne({ email: client_email });
        if (!client) client = await User.create({ email: client_email });
        let app = await App.findById(app_id);

        let instance = new Instance({
            app_id,
            image_id: app.image_selected.ID,
            name: instance_name,
            client: client._id,
        });

        //spustit
        let container_id = docker.run(instance);
        instance.container_id = container_id;
        
        //uložit pokud běží ok
        await instance.save();
        res.send({});
    },
    getStats: async (req, res) => {
        let id = req.query.id;
        console.log("getStats:", id);
        let stats = (await docker.ps(id))[0];
        console.log(stats);
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
