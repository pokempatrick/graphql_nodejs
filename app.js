const express = require("express");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");

const cors = require("cors");
const path = require("path");
const auth = require("./middleware/auth");

// connection à la base de données mangoose
mongoose
    .connect(
        "mongodb://127.0.0.1:27017/Transformers",
        // "mongodb+srv://nodejsbackend:9cKz7LHGegmizz9l@cluster0.jlewrwr.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// transformation du body de la requète en json
app.use(express.json());
// allow cross origin request for graphql
app.use(cors());
// configuration des cors pour faire des requètes entre les applications valide pour express uniquement
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
// app.use(auth);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true,
    })
);
module.exports = app;
