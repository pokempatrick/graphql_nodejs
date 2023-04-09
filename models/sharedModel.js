const mongoose = require("mongoose");

exports.isolementSchema = mongoose.Schema({
    key: { type: String, required: true, unique: true },
    tension: { type: Number, required: true },
    type: { type: String, required: true },
    temps: { type: Number, required: true },
    isolement: { type: Number, required: true },
});

exports.turnRatioSchema = mongoose.Schema({
    key: { type: String, required: true, unique: true },
    bobine: { type: String, required: true },
    ratio: { type: Number, required: true },
    tension: { type: Number, required: true },
    equipment: { type: String },
});

exports.resultSchema = mongoose.Schema({
    anomalie: { type: String, required: true },
    conclusion: { type: String, required: true },
});

exports.qualityInspectionSchema = mongoose.Schema({
    tank: { type: Boolean, default: () => false },
    rust: { type: Boolean, default: () => false },
    paint: { type: Boolean, default: () => false },
    idPlate: { type: Boolean, default: () => false },
    oilLevel: { type: Boolean, default: () => false },
    oilLeak: { type: Boolean, default: () => false },
    damageTerminal: { type: Boolean, default: () => false },
    other: { type: String, default: () => "" },
});

exports.sparePartSchema = mongoose.Schema({
    oilQuantity: { type: Number, default: () => 0 },
    oilBreakdownVoltage: { type: Number },
    oilTank: { type: Number },
    windings: { type: Number, default: () => 0 },
    BtTerminals: { type: Number, default: () => 0 },
    HTAETernminal: { type: Number, default: () => 0 },
    HTAPTerminals: { type: Number, default: () => 0 },
    offLoadAdjuster: { type: Boolean, default: () => false },
    connexion: { type: Boolean, default: () => false },
    tightTorque: { type: Boolean, default: () => false },
    mantleAndJoin: { type: Boolean, default: () => false },
    paperIsolant: { type: Boolean, default: () => false },
    isolationMagnetic: { type: Boolean, default: () => false },
    bulgeMagnetic: { type: Boolean, default: () => false },
    checklist: { type: Boolean, default: () => false },
});

exports.visualInspectionSchema = mongoose.Schema({
    borneBT: { type: Boolean, default: () => false },
    borneHTA: { type: Boolean, default: () => false },
    partieActive: { type: Boolean, default: () => false },
    fuiteHuile: { type: Boolean, default: () => false },
    tankDeform: { type: Boolean, default: () => false },
    other: { type: String, default: () => "" },
});

exports.internInspectionSchema = mongoose.Schema({
    offLoadAdjuster: { type: Boolean, default: () => false },
    winding: { type: Boolean, default: () => false },
    magneticCircuit: { type: Boolean, default: () => false },
    solidInsolation: { type: Boolean, default: () => false },
    oil: { type: Boolean, default: () => false },
    breakdownVoltage: { type: Number },
    testPCB: { type: String, default: () => "Non identifié" },
});

exports.qualityCheckSchema = mongoose.Schema({
    tank: { type: Boolean, default: () => false },
    chinaTorque: { type: Boolean, default: () => false },
    boltTorque13: { type: Boolean, default: () => false },
    boltTorque17: { type: Boolean, default: () => false },
    boltGroover: { type: Boolean, default: () => false },
    boltWasher: { type: Boolean, default: () => false },
    idPlate: { type: Boolean, default: () => false },
    oilLevel: { type: Boolean, default: () => false },
    other: { type: String, default: () => "" },
});
