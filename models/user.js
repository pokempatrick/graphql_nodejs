const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v),
            message: (props) => `${props.value} is not a valid Email`,
        },
    },
    password: { type: String },
    role: [
        {
            type: String,
            enum: {
                values: [
                    "admin",
                    "owner",
                    "manager",
                    "accountant",
                    "technician",
                    "anonyme",
                ],
                message: (props) => `the ${props.value} is not supported`,
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
    imageUrl: { type: String },
    user: {
        email: { type: String },
        _id: { type: String },
    },
});

userSchema.plugin(uniqueValidator);
userSchema.statics.findbyName = function (firstName) {
    return this.where({ firstName: new RegExp(firstName, "i") }).where({
        role: {
            $nin: ["admin"],
        },
    });
};

userSchema.statics.findbyIndexName = function (firstName, limit, page) {
    return this.where({ firstName: new RegExp(firstName, "i") })
        .where({
            role: {
                $nin: ["admin"],
            },
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdDate: "desc", _id: "desc" })
        .select("-user -password");
};

module.exports = mongoose.model("User", userSchema);
