const { buildSchema, print } = require("graphql");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const bookSchema = require("./book.schema");
const authorSchema = require("./author.schema");

const typeDef = mergeTypeDefs([authorSchema, bookSchema]);

module.exports = buildSchema(print(typeDef));
