const Manufacturer = require("../models/manufacturerModel");

exports.new = (req, res, next) => {
    const manufacObject = req.body;
    delete manufacObject._id;
    const manufacturer = new Manufacturer(manufacObject);
    manufacturer
        .save()
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(400).json({ error }));
};

exports.show = (req, res, next) => {
    Manufacturer.findOne({
        _id: req.params.id,
    })
        .then((manufacturer) => {
            res.status(200).json(manufacturer);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.update = (req, res, next) => {
    const manufacObject = req.body;
    Manufacturer.updateOne(
        { _id: req.params.id },
        { ...manufacObject },
        { runValidators: true }
    )
        .then(() =>
            Manufacturer.findOne({ _id: req.params.id }).then((result) =>
                res.status(200).json(result)
            )
        )
        .catch((error) => res.status(400).json({ error }));
};

exports.delete = (req, res, next) => {
    Manufacturer.findOne({ _id: req.params.id })
        .then(() => {
            Manufacturer.deleteOne({ _id: req.params.id })
                .then(() =>
                    res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.index = (req, res, next) => {
    Manufacturer.find()
        .then((manufacturers) => {
            res.status(200).json(manufacturers.map((item) => item.name));
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
