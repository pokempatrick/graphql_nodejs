const StoreEntrance = require("../models/storeEntranceModel");

// contrôle conformité et élimination de l'id envoyé
const checkConformity = (storeObject, req) => {
    storeObject.conformity = Boolean(req.body.newTransfo);
    delete storeObject._id;
    if (!req.body.newTransfo) {
        storeObject.result.anomalie =
            storeObject.result.anomalie + " Transfo existant";
    }
};
// new store object
exports.new = (req, res, next) => {
    const storeObject = req.body;
    storeObject.user = req.user;
    checkConformity(storeObject, req);
    const storeEntrance = new StoreEntrance(storeObject);
    storeEntrance
        .save()
        .then((result) => {
            result
                .populate("transformer")
                .then((resultPopulate) => res.status(201).json(resultPopulate))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
};
// show store object
exports.show = (req, res, next) => {
    StoreEntrance.findOne({
        _id: req.params.id,
    })
        .populate("transformer")
        .then((storeEntrance) => {
            res.status(200).json(storeEntrance);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};
// update store object
exports.update = (req, res, next) => {
    const storeObject = req.body;
    delete storeObject.transformer;
    StoreEntrance.updateOne(
        { _id: req.params.id },
        { ...storeObject },
        { runValidators: true }
    )
        .then(() =>
            StoreEntrance.findOne({ _id: req.params.id })
                .populate("transformer")
                .then((result) => res.status(200).json(result))
        )
        .catch((error) => res.status(400).json({ error }));
};
// delete store object
exports.delete = (req, res, next) => {
    StoreEntrance.findOne({ _id: req.params.id })
        .then(() => {
            StoreEntrance.deleteOne({ _id: req.params.id })
                .then(() =>
                    res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// show all the stores object
exports.index = (req, res, next) => {
    StoreEntrance.find()
        .populate("transformer")
        .then((storeEntrances) => {
            res.status(200).json(storeEntrances);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
