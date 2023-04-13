const { authorResolver } = require("./author.resolver");
const { bookResolver } = require("./book.resolver");

const rootResolver = {
    ...authorResolver,
    ...bookResolver,
};
module.exports = rootResolver;
