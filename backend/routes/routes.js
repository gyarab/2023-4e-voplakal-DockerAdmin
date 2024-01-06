const { authJwt } = require("../middlewares");
const Public = require("../controllers/public.controller");
const Apps = require("../controllers/apps.controller");
const Instances = require("../controllers/instances.controller");
const { getUser } = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/ping", Public.ping);

    app.get("/api/session", [authJwt.verifyToken], async (req, res) => {
        console.log(req.query.id);
        let user = await getUser({ _id: req.query.id });
        res.status(200).send({
            user,
        });
    });

    // APPS
    app.get("/api/app/getAll", [authJwt.verifyToken, authJwt.isAdmin], Apps.getAll);
    app.post("/api/app/create", [authJwt.verifyToken, authJwt.isAdmin], Apps.create);
    app.get("/api/app/availableRepos", [authJwt.verifyToken, authJwt.isAdmin], Apps.getRepos);
    app.delete("/api/app/:id", [authJwt.verifyToken, authJwt.isAdmin], Apps.delete);
    app.put("/api/app/save", [authJwt.verifyToken, authJwt.isAdmin], Apps.save);

    // INSTANCES
    app.get("/api/instance/getAll", [authJwt.verifyToken, authJwt.isAdmin], Instances.getAll);
    app.delete("/api/instances", [authJwt.verifyToken, authJwt.isAdmin], Instances.delete);
    app.post("/api/instances/upgrade", [authJwt.verifyToken, authJwt.isAdmin], Instances.upgrade);
};

