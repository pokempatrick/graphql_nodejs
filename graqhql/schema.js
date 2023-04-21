const path = require("path");
const { buildSchema, print } = require("graphql");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");

const directives = require("./directives");

const { authDirectiveTransformer } = directives.authDirective(
    "auth",
    directives.getUser
);

const typesArray = loadFilesSync(path.join(__dirname, "./schemas"));
const schema = buildSchema(print(mergeTypeDefs(typesArray)));

module.exports = authDirectiveTransformer(schema);
