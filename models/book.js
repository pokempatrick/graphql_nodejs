const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        genre: { type: String, required: true },
        authorId: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
