const docker = require("../docker/docker");
const { App } = require("../models");
const RestError = require("./RestError");

module.exports = {
    getAll: async (req, res) => {
        let images = docker.getImages();
        let apps = await App.find().lean({ virtuals: true });
        console.log(apps);
        images = await images;
        if (!apps) apps = [];
        for (const app of apps) {
            app.images = images.filter((i) => i.Repository === app.repository) ?? [];
            app.selected_image = app.images?.find((i) => i.ID === app.selected_image_id) ?? {};
        }
        res.send(apps);
    },
    create: async (req, res, next) => {
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
        let r = await App.deleteOne({ _id: req.params.id });
        console.log(r);
        res.send({});
    },
    save: async (req, res) => {
        // console.log("save:", req.body);
        let r = await App.findByIdAndUpdate(req.body._id, req.body);
        if (!r) res.status(404).send({});
        res.send({});
    },
};
