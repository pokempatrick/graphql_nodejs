const Diagnostic = require("../models/diagnosticModel");

exports.new = (req, res, next) => {
    // test fonctionnel
    const diagnosObject = req.body;
    delete diagnosObject._id;
    const diagnostic = new Diagnostic(diagnosObject);
    diagnostic
        .save()
        .populate("transformer")
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(400).json({ error }));
};

exports.show = (req, res, next) => {
    Diagnostic.findOne({
        _id: req.params.id,
    })
        .populate("transformer")
        .then((diagnostic) => {
            res.status(200).json(diagnostic);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.update = (req, res, next) => {
    const diagnosObject = req.body;
    Diagnostic.updateOne(
        { _id: req.params.id },
        { ...diagnosObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.delete = (req, res, next) => {
    Diagnostic.findOne({ _id: req.params.id })
        .then(() => {
            Diagnostic.deleteOne({ _id: req.params.id })
                .then(() =>
                    res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.index = (req, res, next) => {
    Diagnostic.find()
        .populate("transformer")
        .then((diagnostics) => {
            res.status(200).json(diagnostics);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
