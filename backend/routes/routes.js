const { authJwt } = require("../middlewares");
const Public = require("../controllers/public.controller");
const Apps = require("../controllers/apps.controller");
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


    app.get("/api/app/getAll", [authJwt.verifyToken, authJwt.isAdmin], Apps.getAll);
    app.post("/api/app/create", [authJwt.verifyToken, authJwt.isAdmin], Apps.create);
    app.get("/api/app/availableRepos", [authJwt.verifyToken, authJwt.isAdmin], Apps.getRepos);
    app.get("/api/app/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], Apps.delete);
    // app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};
