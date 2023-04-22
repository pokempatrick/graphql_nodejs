const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(
            token,
            process.env.SECRET_TOKEN || "RANDOM_TOKEN_SECRET"
        );
        const { _id, email, firstName, lastName, role, limitedAccessDate } =
            await User.findOne({ _id: decodedToken.userId });
        req.user = { _id, email, firstName, lastName, role, limitedAccessDate };
        next();
    } catch {
        throw new Error("Invalid request!");
    }
};
