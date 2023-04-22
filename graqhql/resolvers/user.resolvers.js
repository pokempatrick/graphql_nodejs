const fs = require("fs");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const getRoles = (role, userRole) => {
    if (!role?.includes("admin")) {
        return Array.isArray(userRole)
            ? userRole.filter((item) => !["owner", "admin"].includes(item))
            : ["owner", "admin"].includes(userRole)
            ? "anonyme"
            : userRole;
    }
    return userRole;
};

const getUserObject = (req, inputUser) =>
    req.file
        ? {
              ...inputUser,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...inputUser };

module.exports = {
    // query
    users: ({ page = 1, limit = 10, firstName = "" }) => {
        return User.findbyIndexName(firstName, limit, page)
            .then(async (users) => {
                const count = await User.findbyName(firstName).countDocuments();
                return {
                    users,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                };
            })
            .catch(() => {
                throw new Error("Invalid request");
            });
    },
    user: (args) => User.findById(args.id),

    // mutation
    addUser: (inputUser, req) => {
        const userObject = getUserObject(req, inputUser);
        userObject.user = req.user;
        userObject.limitedAccessDate = req.user?.limitedAccessDate;
        userObject.role = getRoles(req.user?.role, userObject.role);
        return bcrypt.hash("Bonjour2021", 10).then((hash) => {
            const user = new User({
                ...userObject,
                password: hash,
            });
            return user.save().catch(() => {
                throw new Error("Invalid request");
            });
        });
    },

    updateUser: (inputUser, req) => {
        const userObject = getUserObject(req, inputUser);
        delete userObject._id;
        delete userObject.password;
        userObject.limitedAccessDate = req.user?.limitedAccessDate;
        userObject.user = req.user;
        userObject.role = getRoles(req.user?.role, userObject.role);
        return User.updateOne(
            { _id: inputUser.id },
            { ...userObject },
            { runValidators: true }
        )
            .then(() => User.findOne({ _id: inputUser.id }))
            .catch(() => {
                throw new Error("Invalid request");
            });
    },

    updatePassword: ({ password }, req) => {
        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(password)) {
            return User.findOne({
                _id: req.user._id,
            })
                .then((user) => {
                    return bcrypt
                        .hash(password, 10)
                        .then((hash) => {
                            user.password = hash;
                            return user
                                .save()
                                .then(() => ({
                                    message: "Mot de passe modifié",
                                }))
                                .catch(() => {
                                    throw new Error("Invalid request");
                                });
                        })
                        .catch(() => {
                            throw new Error("Invalid request");
                        });
                })
                .catch(() => {
                    throw new Error("Invalid request");
                });
        } else {
            throw new Error(
                "Mode Passe longueur de 8 min et 20 max, des majuscules, minuscules et chiffres"
            );
        }
    },

    updateLimitAccessDate: ({ limitedAccessDate }) =>
        User.updateMany({}, { limitedAccessDate })
            .then(() => ({ message: "Mise à jour éffectuée !" }))
            .catch(() => {
                throw new Error("Invalid request");
            }),

    deleteUser: ({ id }) =>
        User.findOne({ _id: id }).then((user) => {
            const filename = user?.imageUrl?.split("/images/")[1];
            fs.unlink(`images/${filename}`, () =>
                User.deleteOne({ _id: id }).catch(() => {
                    throw new Error("Invalid request");
                })
            );
            return { message: "Objet supprimé !" };
        }),
};
