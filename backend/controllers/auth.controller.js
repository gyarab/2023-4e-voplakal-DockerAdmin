const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const email = require("../email");

exports.signup = async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(validatePasswd(req.body.password), 8),
        });
        await user.save();

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

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(400).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_Secret, {
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
class TokensArray extends Array {
    push(token) {
        setTimeout(() => {
            const index = this.indexOf(token);
            if (index > -1) {
                // only splice array when item is found
                this.splice(index, 1); // 2nd parameter means remove one item only
            }
        }, 3 * 60 * 60000);
        return super.push(token);
    }
}
let tokensArray = new TokensArray();

exports.forgottenPasswd = async (req, res) => {
    let user = await this.getUser({ email: req.body.email });

    if (!user) {
        return res.status(469).send({ message: "User Not found." });
    }

    let token = (Math.random() + 1).toString(17).substring(2);
    tokensArray.push({
        user: user._id,
        token,
    });
    console.log(tokensArray);

    let link = "http://localhost:3000/#/login/" + token;

    // email.send({
    //     to: user.email,
    //     subject: "Žádost o změnu hesla",
    //     text: "Pokud si přejete změnit heslo do administračního systému DUCK klikněte na následijící odkaz: " + link + "\nPokud jste o změnu nežádali ignorujte tuto zprávu",
    // });
    console.log("token: " + token);

    res.status(200).send({
        message: "Email with instructions have been sent.",
    });
};
exports.createPasswd = async (req, res) => {
    console.log(tokensArray);
    console.log(req.body.tokens);
    let token = tokensArray.find((t) => t.token === req.body.token);
    if (!token) {
        return res.status(469).send({ message: "Expired attempt token. Please try forogotten password again." });
    }
    console.log("token: ", token);
    let user = await User.findById(token.user);

    if (!user) {
        return res.status(469).send({ message: "User Not found." });
    }
    user.password = bcrypt.hashSync(validatePasswd(req.body.newPass), 8);
    user.save();
    const index = tokensArray.indexOf(token);
    tokensArray.splice(index, 1);

    res.status(200).send({
        message: "Sucess",
    });
};

exports.getUser = async (query) => {
    let user = await User.findOne(query).populate("roles", "-__v").lean();
    if (!user) return;

    for (let i = 0; i < user.roles.length; i++) {
        user.roles[i] = user.roles[i].name.toUpperCase();
    }

    return user;
};

function validatePasswd(/**@type {String} */ pass) {
    let len = +process.env.PASS_LEN;
    if (pass.length < len) throw "Password has to have more than " + len + " characters.";
    return pass;
}
