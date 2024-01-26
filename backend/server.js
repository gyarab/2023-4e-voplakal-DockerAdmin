const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const docker = require("./docker/docker");
const fixtures = require("./models/fixtures");
require("dotenv").config({ path: "./.env" });

module.exports.wrap = function wrap(fn) {
    return (req, res, next) => {
        fn(req, res).catch(next);
    };
};

const app = express();

var corsOptions = {
    origin: "http://localhost:8081",
};

// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT;
if (!PORT) {
    console.error("env PORT not specified");
    process.exit(1);
}

// routes
require("./routes/auth.routes")(app);
require("./routes/routes")(app);

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

// setInterval(checkExpiry, 30000);

checkExpiry();

async function checkExpiry() {
    let instances = await Instance.find({ expiry_date: { $lte: new Date().toISOString().split("T")[0] } }); //should be all stopped
    let ps = await docker.ps();
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
            }
        }
    }
}
