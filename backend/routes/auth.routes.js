const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { wrap } = require("../server");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

    app.post("/api/auth/signin", controller.signin);
    app.post("/api/auth/forgotten-passwd", wrap(controller.forgottenPasswd));
    app.post("/api/auth/createPasswd", wrap(controller.createPasswd));
};
