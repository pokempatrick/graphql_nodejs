const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const manufacturerSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    // country: { type: String, required: true },
});
manufacturerSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Manufacturer", manufacturerSchema);
