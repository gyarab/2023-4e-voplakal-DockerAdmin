const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const db = require("../models");
const { getUser } = require("../controllers/auth.controller");
const User = db.user;
const Role = db.role;

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get("/api/session", [authJwt.verifyToken], async (req, res) => {
        let user = await getUser({ id: req.body.id });

        res.status(200).send({
            user,
        });
    });

    app.get("/api/test/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

    app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};
