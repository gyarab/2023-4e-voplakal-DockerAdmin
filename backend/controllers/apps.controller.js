const docker = require("../docker/docker");
const { App } = require("../models");
const { appsData, instances } = require("../models/fixtures");
const RestError = require("./RestError");

module.exports = {
    getAll: async (req, res) => {
        let apps = await App.find();
        if (!apps) apps = [];
        res.send(apps);
    },
    create: async (req, res, next) => {
        console.log(req.body);
        const { repoImageName, newAppName } = req.body;
        // let appID = "123432341ščř";
        if (!newAppName || !repoImageName) throw new Error("missing body prop");
        if (await App.exists({ repository: repoImageName })) throw new RestError("app from this image already exists", 400);

        let folder =
            String(repoImageName)
                .toLowerCase()
                .replace(/\\|:|\/|"|\*|\||\?/g, "-") + "_data";
        let images = (await docker.getImages()).filter((i) => i.Repository === repoImageName);
        const { id } = await new App({ name: newAppName, repository: repoImageName, folder, images }).save();
        console.log("create", id);
        res.send({ appID: id });
    },
    getRepos: async (req, res) => {
        let images = await docker.getImages();
        images = images.map((r) => r.Repository);
        images = [...new Set(images)];
        let appsRepos = (await App.find({}, { repository: 1 })).map((a) => a.repository);
        console.log(appsRepos);
        images = images.filter((i) => !appsData.some((a) => i === a));
        res.send(images);
    },
    delete: async (req, res) => {
        console.log("delete:", req.params.id);
        let r = await App.deleteOne({ _id: req.params.id });
        console.log(r);
        res.send({});
    },
    save: async (req, res) => {
        console.log("save:", req.body);
        res.send({});
    },
};
