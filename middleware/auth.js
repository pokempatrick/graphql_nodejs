const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = async (req, res, next) => {
    try {
        if (
            !(
                req.body.query?.includes("login") ||
                req.body.query?.includes("sendCode") ||
                req.body.query?.includes("checkCode")
            )
        ) {
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                const decodedToken = jwt.verify(
                    token,
                    process.env.SECRET_TOKEN || "RANDOM_TOKEN_SECRET"
                );
                const {
                    _id,
                    email,
                    firstName,
                    lastName,
                    role,
                    limitedAccessDate,
                } = await User.findOne({ _id: decodedToken.userId });
                req.user = {
                    _id,
                    email,
                    firstName,
                    lastName,
                    role,
                    limitedAccessDate,
                };
            }
        }
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
