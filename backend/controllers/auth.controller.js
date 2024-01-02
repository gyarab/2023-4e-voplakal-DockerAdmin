const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        await user.save();
        console.log(user);

        if (req.body.roles) {
            let roles = await Role.find({
                name: { $in: req.body.roles },
            });

            user.roles = roles.map((role) => role._id);
            await user.save();

            res.send({ message: "User was registered successfully!" });
        } else {
            let role = await Role.findOne({ name: "user" });

            user.roles = [role._id];
            await user.save();

            res.send({ message: "User was registered successfully!" });
        }
    } catch (error) {
        next(error);
    }
};

exports.signin = async (req, res, next) => {
    try {
        let user = await this.getUser({ username: req.body.username });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        console.log(user);

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(400).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_Secret, {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            accessToken: token,
        });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (query) => {
    let user = await User.findOne(query).populate("roles", "-__v").lean();
    console.log(user);
    if (!user) return;

    for (let i = 0; i < user.roles.length; i++) {
        user.roles[i] = user.roles[i].name.toUpperCase();
    }
    console.log(user);
    return user;
};