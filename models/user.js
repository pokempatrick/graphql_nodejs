const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Array },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User1", userSchema);
