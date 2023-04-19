const path = require("path");
const { mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const authorResolver = require("./resolvers/author.resolver");
const bookResolver = require("./resolvers/book.resolver");

const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"));

// module.exports = mergeResolvers(resolversArray);
module.exports = { ...authorResolver, ...bookResolver };
