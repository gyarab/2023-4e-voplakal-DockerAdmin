const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.App = require("./app.model")
// db.Instance = require("./instnace.model")

db.ROLES = ["user", "admin",];

module.exports = db;