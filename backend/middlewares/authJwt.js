const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
        console.log(decoded);
        if (err && !decoded.id) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        console.log(req.userId);
        next();
    });
};

isAdmin = async (req, res, next) => {
    try {
        let user = await User.findById(req.userId);

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
};
module.exports = authJwt;
