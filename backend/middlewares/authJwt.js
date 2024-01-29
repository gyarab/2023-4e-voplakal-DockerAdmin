const jwt = require("jsonwebtoken");
const db = require("../models");
const { getUser } = require("../controllers/auth.controller");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
        if (err && !decoded?.id) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

/**
 * adds user to req.user
 */
const loadUser = async (req, res, next) => {
    if (!req.userId) return next();
    try {
        let user = await getUser({_id: req.userId});
        req.user = user;
        return next();
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.name + ": " + err.message });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        let user = await User.findById(req.userId).lean();

        let roles = await Role.find({
            _id: { $in: user.roles },
        });

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                next();
                return;
            }
        }

        res.status(403).send({ message: "Require Admin Role!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.name + ": " + err.message });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    loadUser,
};
module.exports = authJwt;
