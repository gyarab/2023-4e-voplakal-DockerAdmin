const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    //if do not have passwd it is shadow account created on insctance create
    try {
        // Username
        let user = await User.findOne({
            username: req.body.username,
        });

        if (user && user.password) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }

        // Email
        user = await User.findOne({
            email: req.body.email,
        });

        if (user && user.password) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err.name + ": " + err.message });
    }
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`,
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
};

module.exports = verifySignUp;
