require("dotenv").config({ path: "./.env" });
const express = require("express");
const stripeController = require("./controllers/stripe.controller");
const { authJwt } = require("./middlewares");
const bodyParser = require("body-parser");
const cors = require("cors");
const docker = require("./docker/docker");
const fixtures = require("./models/fixtures");
const path = require("path");
const fs = require("fs");

const STATIC_PUBLIC = path.join(__dirname, "vue_build");

// const wrap = function wrap(fn) {
//     return (req, res, next) => {
//         try {
//             fn(req, res);
//         } catch (error) {
//             next();
//         }
//     };
// };
function wrap(fn) {
    return (req, res, next) => {
        fn(req, res).catch(next);
    };
}
module.exports.wrap = wrap;

const app = express();
app.post("/api/webhook", bodyParser.raw({ type: "application/json" }), wrap(stripeController.webhook)); //must be before bodyparser.json()

var corsOptions = {
    origin: "http://localhost:8081",
};

// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set port, listen for requests
const PORT = process.env.PORT;
if (!PORT) {
    console.error("env PORT not specified");
    process.exit(1);
}

// routes
app.post("/api/stripe/create-checkout-session", [authJwt.verifyToken, authJwt.loadUser], wrap(stripeController.createCheckoutSession));
require("./routes/auth.routes")(app);
require("./routes/routes")(app);
app.use(express.static(STATIC_PUBLIC));
app.get("*", (req, res) => {
    res.sendFile(path.join(STATIC_PUBLIC, "index.html"));
});

const db = require("./models");
const Instance = require("./models/instance.model");
const email = require("./email");
const User = require("./models/user.model");

db.mongoose
    .connect(process.env.MongoDB_URI, {})
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initDB();
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit(1);
    });

async function initDB() {
    let Role = db.role;
    if ((await Role.estimatedDocumentCount()) === 0) {
        await new Role({
            name: "user",
        }).save();
        await new Role({
            name: "admin",
        }).save();
        console.log("added 'user' to roles collection");
    }
    return;
    await db.App.deleteMany();
    await Instance.deleteMany();

    if ((await db.App.estimatedDocumentCount()) === 0) {
        await db.App.insertMany(fixtures.appsData);
        console.log("added 'apps' fixtures");
    }
    if ((await Instance.estimatedDocumentCount()) <= 0) {
        Instance.create(fixtures.instances[0]);
        console.log("added 'instances' fixtures");
    }
}

//error handling
app.use((err, req, /**@type {import("express").Response} */ res, next) => {
    console.error("error handling:\n", err);
    if (!res.writable) return;

    if (typeof err !== "object") return res.status(500).send({ message: err });

    const { name, message, cause, status } = err;
    res.status(status ?? 500).send({ message: name + ": " + message });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// EXPIRY INSTANCE

setInterval(checkExpiry, 3 * 60 * 60 * 1000);

// checkExpiry();

async function checkExpiry() {
    let instances = await Instance.find({ expiry_date: { $lte: new Date().toISOString().split("T")[0] } }); //should be all stopped
    let ps = await docker.ps().catch((e) => {
        console.error("Can not check expiry. Docker ps sh Error\n" + e);
        process.exit(1);
    });
    ps = ps.filter((c) => c.State === "running"); // running containers

    for (const instance of instances) {
        for (const container of ps) {
            if (instance.container_id === container.ID) {
                console.log("stopping");
                await docker.stop(container.ID);
                let user = await User.findById(instance.client);
                let app = await db.App.findById(instance.app_id);
                email.send({
                    to: user.email,
                    subject: "Vaše aplikace " + instance.name + " byla pozastavena",
                    text: "Vaše aplikace " + instance.name + " expirovala a byla proto pozastavena. Pokud máte zájem aplikaci " + app.name + " i nadále používat, kontaktujte nás prosím na email.",
                });
                email.send({
                    to: process.env.ADMIN_EMAIL,
                    subject: "DUCK aplikace " + instance.name + " uživatele " + user.email + " expirovala",
                });
            }
        }
    }
}

var dir = "./mounts";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

let r = process.env.PORT_RANGE.split("-");
global.instancesCountLimit = r[1] - r[0];
global.PORT_RANGE = { start: +r[0], end: +r[1] };
