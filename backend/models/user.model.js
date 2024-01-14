const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, default: function() {
      return this.email.split("@")[0];
    } },
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: []
      }
    ]
  })
);

module.exports = User;