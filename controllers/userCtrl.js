const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// new user
exports.new = (req, res, next) => {
    const useObject = req.body;
    useObject.user = req.user;
    bcrypt
        .hash("Bonjour2021", 10)
        // .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                ...useObject,
                password: hash,
            });
            user.save()
                .then((result) => res.status(201).json(result))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// update user
exports.update = (req, res, next) => {
    const useObject = req.body;
    delete useObject._id;
    delete useObject.password;
    useObject.user = req.user;
    User.updateOne(
        { _id: req.params.id },
        { ...useObject },
        { runValidators: true }
    )
        .then(() =>
            User.findOne({ _id: req.params.id }).then((result) =>
                res.status(200).json(result)
            )
        )
        .catch((error) => res.status(400).json({ error }));
};

// delete user
exports.delete = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(() => {
            User.deleteOne({ _id: req.params.id })
                .then(() =>
                    res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// findOne user
exports.show = (req, res, next) => {
    User.findOne({
        _id: req.params.id,
    })
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status(400).json({ error }));
};

// findAll the users
exports.index = (req, res, next) => {
    User.find()
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => res.status(400).json({ error }));
};

// update Role
exports.updateRoles = (req, res, next) => {
    User.findOne({
        _id: req.params.id,
    })
        .then((user) => {
            if (user !== null) {
                user.role = req.body.role;
                user.save()
                    .then((user) => res.status(200).json(user))
                    .catch((error) => res.status(400).json({ error }));
            } else {
                res.status(404).json({ error: "utilisateur non trouvé" });
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

// update password
exports.updatePassword = (req, res, next) => {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(req.body.password)) {
        User.findOne({
            _id: req.params.id,
        })
            .then((user) => {
                if (user.email === req.user.email) {
                    bcrypt
                        .hash(req.body.password, 10)
                        .then((hash) => {
                            user.password = hash;
                            user.save()
                                .then((result) => res.status(201).json(result))
                                .catch((error) =>
                                    res.status(400).json({ error })
                                );
                        })
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    res.status(403).json({
                        error: "Utilisateur Non authorisé",
                    });
                }
            })
            .catch((error) => res.status(404).json({ error }));
    } else {
        res.status(403).json({
            error: "Mode Passe longueur de 6 min et 20 max, des majuscules, minuscules et chiffres",
        });
    }
};
