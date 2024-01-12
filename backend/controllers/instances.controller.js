const { appsData, instances } = require("../models/fixtures");
const Instance = require("../models/instance.model");

module.exports = {
    getAll: async (req, res) => {
        let i = await Instance.find();
        if (!i) i = [];
        res.send(i);
    },
    delete: async (req, res) => {
        console.log("delete:", req.body.ids);
        await Instance.deleteMany({
            _id: { $in: req.body.ids }
          })
        res.send({});
    },

    upgrade: async (req, res) => {
        console.log("upgrade:", req.body.ids, req.body.tag);
        req.res.send({});
    },
    save: async (req, res) => {
        let instance = req.body;
        console.log("save:", instance);
        req.res.send({});
    },
    start: async (req, res) => {
        let instanceId = req.body.id;
        console.log("start:", instanceId);
        req.res.send({});
    },
    create: async (req, res) => {
        let instance = req.body;
        console.log("create:", instance);
        // await Instance.create(instance)
        req.res.send({});
    },
};