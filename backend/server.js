const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fixtures = require("./models/fixtures");
require("dotenv").config({ path: "./.env" });

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

    if (typeof err !== "object") res.status(500).send({ message: err });

    const { name, message, cause, status } = err;
    res.status(status ?? 500).send({ message: name + ": " + message });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
