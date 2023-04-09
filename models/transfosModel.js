const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const tranfoSchema = mongoose.Schema({
    serie: { type: String, required: true, unique: true },
    matricule: { type: String, unique: true, minLength: 8 },
    norme: { type: String },
    manufacturer: { type: String, required: true },
    tensioncourtcircuit: { type: Number },
    noloadcurent: { type: Number },
    primarytension: { type: Number, required: true },
    secondarytension: { type: Number, required: true },
    puissance: { type: Number, required: true },
    secondarycurrent: { type: Number },
    primarycurrent: { type: Number },
    couplage: { type: String, required: true },
    year: { type: Number },
    oil: { type: Number },
    commutateur: { type: Number },
    updatedDate: { type: Date, default: () => Date.now() },
    createdDate: { type: Date, default: () => Date.now(), immutable: true },
    user: {
        email: { type: String, required: true },
        id: { type: String, required: true },
    },
});
tranfoSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Transfo", tranfoSchema);
