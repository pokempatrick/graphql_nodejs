const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../../models/user");

const sendRecoverMail = (userEmail, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL || "gestiontransfo@gmail.com",
            pass: process.env.EMAIL_PASSWORD || "hrohoorirfgcxyes",
        },
    });

    const mailOptions = {
        from: process.env.EMAIL || "gestiontransfo@gmail.com",
        to: userEmail,
        subject: "Recover Password",
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
module.exports = {
    // query
    login: ({ email, password }, req) => {
        return User.findOne({ email }).then((user) => {
            if (!user) {
                throw new Error("User does not exist");
            }
            return bcrypt.compare(password, user.password).then((valid) => {
                if (!valid) {
                    throw new Error("Password incorrect");
                }
                return {
                    userId: user._id,
                    token: jwt.sign(
                        {
                            userId: user._id,
                            userRole: user.role,
                            userEmail: user.email,
                        },
                        process.env.SECRET_TOKEN || "RANDOM_TOKEN_SECRET",
                        { expiresIn: "24h" }
                    ),
                };
            });
        });
    },

    sendCode: ({ email }) => {
        return User.findOne({ email }).then((user) => {
            if (!user) {
                throw new Error("User does not exist");
            }
            const uncripted_code = Math.floor(Math.random() * 10000).toString();
            return bcrypt.hash(uncripted_code, 10).then((hash) => {
                user.code = hash;
                sendRecoverMail(user.email, uncripted_code);
                return {
                    message: "Code de vérification envoyé",
                    userId: user._id,
                    token: jwt.sign(
                        {
                            userId: user._id,
                            userRole: user.role,
                            code: user.code,
                        },
                        process.env.SECRET_TOKEN_2 || "RANDOM_TOKEN_SECRET4",
                        { expiresIn: "1h" }
                    ),
                };
            });
        });
    },
    checkCode: ({ code }) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(
                token,
                process.env.SECRET_TOKEN_2 || "RANDOM_TOKEN_SECRET4"
            );
            return bcrypt
                .compare(code.toString(), decodedToken.code.toString())
                .then((valid) => {
                    if (!valid) {
                        throw new Error("Invalid code!");
                    }
                    return User.findOne({ _id: decodedToken.userId }).then(
                        (user) => {
                            if (!user) {
                                throw new Error("User not found!");
                            }
                            return {
                                userId: user._id,
                                userRole: user.role,
                                token: jwt.sign(
                                    {
                                        userId: user._id,
                                        userRole: user.role,
                                        userEmail: user.email,
                                    },
                                    process.env.SECRET_TOKEN ||
                                        "RANDOM_TOKEN_SECRET",
                                    { expiresIn: "24h" }
                                ),
                            };
                        }
                    );
                });
        } catch {
            throw new Error("Invalid request!");
        }
    },
};
