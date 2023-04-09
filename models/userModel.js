const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v),
            message: (props) => `{props.value} is not a valid Email`,
        },
    },
    password: { type: String },
    role: [
        {
            type: String,
            enum: {
                values: ["admin", "manager", "technician", "labor"],
                message: "the {VALUE} is not supported ",
            },
        },
    ],
    firstName: { type: String },
    lastName: { type: String },
    limitedAccessDate: { type: Date },
    enterprise: { type: String },
    createdDate: { type: Date, default: () => Date.now(), immutable: true },
    updatedDate: { type: Date, default: () => Date.now() },
    phoneNumber: { type: Number },
    smsAPIkye: { type: String },
    user: {
        email: { type: String },
        id: { type: String },
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
