const { authJwt } = require("../middlewares");
const Public = require("../controllers/public.controller");
const Apps = require("../controllers/apps.controller");
const Instances = require("../controllers/instances.controller");
const { getUser } = require("../controllers/auth.controller");
const { wrap } = require("../server");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/ping", Public.ping);

    app.get("/api/session", [authJwt.verifyToken], async (req, res) => {
        console.log(req.query.id);
        let user = await getUser({ _id: req.query.id });
        if (!user) return res.status(401).send({});
        res.status(200).send({
            user,
        });
    });

    // APPS
    app.get("/api/app/getAll", [authJwt.verifyToken, authJwt.loadUser], wrap(Apps.getAll));
    app.post("/api/app/create", [authJwt.verifyToken, authJwt.isAdmin], wrap(Apps.create));
    app.get("/api/app/availableRepos", [authJwt.verifyToken, authJwt.isAdmin], wrap(Apps.getRepos));
    app.delete("/api/app/:id", [authJwt.verifyToken, authJwt.isAdmin], wrap(Apps.delete));
    app.put("/api/app/save", [authJwt.verifyToken, authJwt.isAdmin], wrap(Apps.save));

    // INSTANCES
    app.get("/api/instance/getAll", [authJwt.verifyToken, authJwt.loadUser], wrap(Instances.getAll));
    app.post("/api/instances/upgrade", [authJwt.verifyToken, authJwt.isAdmin], wrap(Instances.upgrade));
    app.post("/api/instance/save", [authJwt.verifyToken, authJwt.isAdmin], wrap(Instances.save));
    app.post("/api/instance/start", [authJwt.verifyToken, authJwt.isAdmin], wrap(Instances.start));
    app.post("/api/instance/stop", [authJwt.verifyToken, authJwt.isAdmin], wrap(Instances.stop));
    app.get("/api/instance/getStats", [authJwt.verifyToken, authJwt.isAdmin], wrap(Instances.getStats));
    app.delete("/api/instances", [authJwt.verifyToken, authJwt.loadUser], wrap(Instances.delete));
    app.post("/api/instance/create", [authJwt.verifyToken], wrap(Instances.create));
};
