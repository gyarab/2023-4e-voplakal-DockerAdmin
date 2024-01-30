const docker = require("../docker/docker");
const { App } = require("../models");
const Instance = require("../models/instance.model");
const RestError = require("./RestError");

module.exports = {
    getAll: async (req, res) => {
        console.log(req.user.roles);
        if (req.user.roles.includes("ADMIN")) {
            let images = docker.getImages();
            let apps = await App.find().lean({ virtuals: true });
            images = await images;
            if (!apps) apps = [];
            for (const app of apps) {
                app.images = images.filter((i) => i.Repository === app.repository) ?? [];
                app.selected_image = app.images?.find((i) => i.ID === app.selected_image_id) ?? {};
            }
            res.send(apps);
        } else if (req.user.roles.includes("USER")) {
            // let images = docker.getImages(); // todo cache
            let apps = await App.find().lean({ virtuals: true });
            if (!apps) apps = [];
            res.send(apps);
        } else {
            res.status(401).send();
        }
    },
    create: async (req, res, next) => {
        const { repoImageName, newAppName } = req.body;
        // let appID = "123432341ščř";
        if (!newAppName || !repoImageName) throw new Error("missing body prop");
        if (await App.exists({ repository: repoImageName })) throw new RestError("app from this image already exists", 400);

        let folder =
            String(repoImageName)
                .toLowerCase()
                .replace(/\\|:|\/|"|\*|\s|\||\?/g, "-") + "_scripts";
        let selected_image_id = (await docker.getImages()).find((i) => i.Repository === repoImageName).ID;
        const { id } = await new App({ name: newAppName, repository: repoImageName, folder, selected_image_id }).save();
        res.send({ appID: id });
    },
    getRepos: async (req, res) => {
        let images = await docker.getImages();
        images = images.map((r) => r.Repository);
        images = [...new Set(images)];
        let appsRepos = (await App.find({}, { repository: 1 })).map((a) => a.repository);
        images = images.filter((i) => !appsRepos.some((a) => i === a));
        res.send(images);
    },
    delete: async (req, res) => {
        console.log("delete:", req.params.id);
        let a = await App.findOne({ _id: req.params.id });
        let c = await Instance.countDocuments({ app_id: a.id });
        if (c > 0) {
            return res.status(400).send({ message: "Can not delete app of running instance" });
        }
        a.remove();
        res.send({});
    },
    save: async (req, res) => {
        // console.log("save:", req.body);
        try {
            await App.checkScripts(req.body);
        } catch (error) {
            return res.status(469).send({
                message: error,
            });
        }
        let r = await App.findByIdAndUpdate(req.body._id, req.body);
        if (!r) res.status(404).send({});
        res.send({});
    },
};
