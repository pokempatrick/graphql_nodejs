const Author = require("../../models/author");
const { transformAuthor } = require("./merge");

exports.authorResolver = {
    // queries
    author: (args) =>
        Author.findById(args.id).then((author) => transformAuthor(author)),
    authors: () =>
        Author.find({}).then((authors) =>
            authors.map((author) => transformAuthor(author))
        ),

    // mutation
    addAuthor: ({ name }) =>
        new Author({
            name,
        })
            .save()
            .then((author) => transformAuthor(author)),

    updateAuthor: (author) => {
        return Author.updateOne({ _id: author.id }, { ...author }).then(() =>
            Author.findById(author.id).then((author) => transformAuthor(author))
        );
    },
    deleteAuthor: ({ id }) => {
        return Author.deleteOne({ _id: id }).then(() => ({
            message: `Object ${id} deleted`,
        }));
    },
};
