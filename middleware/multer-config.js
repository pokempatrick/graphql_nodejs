const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = file.mimetype;
        if (
            ext !== "image/png" &&
            ext !== "image/jpg" &&
            ext !== "image/jpeg"
        ) {
            return callback(new Error("Only images are allowed"));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 512,
    },
}).single("image");
