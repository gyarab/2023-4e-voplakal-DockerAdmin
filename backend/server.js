const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
const Role = db.role;

db.mongoose
    .connect(process.env.MongoDB_URI, {})
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

async function initial() {
    let count = await Role.estimatedDocumentCount();
    if (count > 0) return;

    await new Role({
        name: "user",
    }).save();
    await new Role({
        name: "admin",
    }).save();

    console.log("added 'user' to roles collection");
}

//error handling
app.use((err, req, res, next) => {
    console.error(err);

    if (typeof err === "string") res.status(500).send({ message: err });

    const { name, message, cause } = err;
    res.status(500).send({ message: name + ": " + message });
});
