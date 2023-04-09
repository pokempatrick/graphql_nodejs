const mongoose = require("mongoose");

const diagnoSchema = mongoose.Schema({
    transformer: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Transfo",
    },
    inspectionVisuelle: {
        borneBT: Boolean,
        borneHTA: Boolean,
        partieActive: Boolean,
        fuiteHuile: Boolean,
        tankDeform: Boolean,
        other: String,
    },
});

module.exports = mongoose.model("Diagnos", diagnoSchema);
