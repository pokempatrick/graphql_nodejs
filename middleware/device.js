const Transfo = require("../models/transfosModel");

const add = async (transfoObject) => {
    delete transfoObject._id;
    const transfo = new Transfo(transfoObject);
    return await transfo.save();
};

const find = async (transfo) => {
    return await Transfo.findOne({
        serie: transfo.serie,
        manufacturer: transfo.manufacturer,
    });
};
exports.getId = async (req, res, next) => {
    try {
        const transfoObject = req.body.transformer;
        transfoObject.user = req.user;
        const fetchTransfo = await find(transfoObject);
        if (fetchTransfo) {
            req.body.transformer = fetchTransfo._id;
        } else {
            const newTransfo = await add(transfoObject);
            req.body.transformer = newTransfo._id;
            req.body.newTransfo = true;
        }
        next();
    } catch (error) {
        res.status(401).json({
            error: error,
        });
    }
};
exports.update = (req, res, next) => {
    const transfoObject = req.body.transfo;
    const fetchTransfo = find(transfoObject);
    Transfo.updateOne(
        { _id: fetchTransfo._id },
        { ...fetchTransfo, immatriculation: transfoObject.immatriculation }
    )
        .then(() => next())
        .catch((error) => res.status(400).json({ error }));
};
