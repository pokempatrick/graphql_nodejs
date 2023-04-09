const mongoose = require("mongoose");
const sharedSchema = require("./sharedModel");
const uniqueValidator = require("mongoose-unique-validator");

const storeEntranceSchema = mongoose.Schema({
    key: { type: String, required: true, unique: true },
    statut: { type: Boolean, default: () => true },
    conformity: { type: Boolean, default: () => true },
    user: {
        email: { type: String, required: true },
        id: { type: String, required: true },
    },
    qualityInspection: sharedSchema.qualityInspectionSchema,
    result: sharedSchema.resultSchema,
    transformer: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Transfo",
    },
    date: { type: Date, default: () => Date.now() },
    createdDate: { type: Date, default: () => Date.now(), immutable: true },
    turnRatios: [{ type: sharedSchema.turnRatioSchema }],
    isolements: [{ type: sharedSchema.isolementSchema }],
});

storeEntranceSchema.plugin(uniqueValidator);
module.exports = mongoose.model("storeEntrance", storeEntranceSchema);
