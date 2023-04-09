const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { roles } = require("./roles");
exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const user = {};
        user.id = decodedToken.userId;
        user.role = decodedToken.userRole;
        user.email = decodedToken.userEmail;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            // error: new Error("Invalid request!"),
            error: error,
        });
    }
};

exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            let granted = false;
            req.user.role.map((role) => {
                const permission = roles.can(role)[action](resource);
                granted = permission.granted || granted;
            });
            if (!granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action",
                });
            }
            next();
        } catch (error) {
            res.status(401).json({
                error: new Error("Invalid request!"),
            });
            console.log(error);
        }
    };
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Utilisateur non trouvé !" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: "Mot de passe incorrect !" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {
                                userId: user._id,
                                userRole: user.role,
                                userEmail: user.email,
                            },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

const sendRecoverMail = (userEmail, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "gestiontransfo@gmail.com",
            pass: "hrohoorirfgcxyes",
        },
    });

    const mailOptions = {
        from: "gestiontransfo@gmail.com",
        to: userEmail,
        subject: "Transformer App recover password",
        text: `This the your code to recover the Password ${code}, 
        I'll be valid for one hour.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.sendCode = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Utilisateur non trouvé !" });
            }
            user.code = Math.floor(Math.random() * 10000);
            sendRecoverMail(user.email, user.code);
            res.status(200).json({
                message: "Code de vérification envoyé",
                userId: user._id,
                token: jwt.sign(
                    {
                        userId: user._id,
                        userRole: user.role,
                        code: user.code,
                    },
                    "RANDOM_TOKEN_SECRET4",
                    { expiresIn: "1h" }
                ),
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
exports.checkCode = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET4");
        const user = {};
        user.id = decodedToken.userId;
        user.role = decodedToken.userRole;
        req.user = user;
        if (req.body.code === decodedToken.code) {
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id, userRole: user.role },
                    "RANDOM_TOKEN_SECRET",
                    { expiresIn: "24h" }
                ),
            });
        } else {
            res.status(401).json({
                error: new Error("Invalid code!"),
            });
        }
    } catch {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};
