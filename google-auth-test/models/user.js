const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  googleID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
