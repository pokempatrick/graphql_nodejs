const path = require("path");
const { buildSchema, print } = require("graphql");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");

const typesArray = loadFilesSync(path.join(__dirname, "./schemas"));

module.exports = buildSchema(print(mergeTypeDefs(typesArray)));
