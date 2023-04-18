const Transfo = require("../models/transfosModel");

exports.new = (req, res, next) => {
    const transfoObject = req.body;
    transfoObject.user = req.user;
    delete transfoObject._id;
    const transfo = new Transfo(transfoObject);
    transfo
        .save()
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(400).json({ error }));
};

exports.show = (req, res, next) => {
    Transfo.findOne({
        _id: req.params.id,
    })
        .then((transfo) => {
            res.status(200).json(transfo);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.update = (req, res, next) => {
    const transfoObject = req.body;
    delete transfoObject._id;
    transfoObject.user = req.user;
    Transfo.updateOne(
        { _id: req.params.id },
        { ...transfoObject },
        { runValidators: true }
    )
        .then(() =>
            Transfo.findOne({ _id: req.params.id }).then((result) =>
                res.status(200).json(result)
            )
        )
        .catch((error) => res.status(400).json({ error }));
};

exports.delete = (req, res, next) => {
    Transfo.findOne({ _id: req.params.id })
        .then(() => {
            Transfo.deleteOne({ _id: req.params.id })
                .then(() =>
                    res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.index = (req, res, next) => {
    Transfo.find()
        .then((transfos) => {
            res.status(200).json(transfos);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
