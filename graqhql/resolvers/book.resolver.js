const Book = require("../../models/book");
const { transformBook } = require("../../helpers/merge");

module.exports = {
    // query
    books: () =>
        Book.find({}).then((books) => books.map((book) => transformBook(book))),
    book: (args) => Book.findById(args.id).then((book) => transformBook(book)),

    // mutation
    addBook: ({ genre, authorId, name }) =>
        new Book({
            name,
            genre,
            authorId,
        })
            .save()
            .then((book) => transformBook(book)),

    updateBook: (book) => {
        return Book.updateOne({ _id: book.id }, { ...book }).then(() =>
            Book.findById(book.id).then((book) => transformBook(book))
        );
    },
    deleteBook: ({ id }) => {
        return Book.deleteOne({ _id: id }).then(() => ({
            message: `Object ${id} deleted`,
        }));
    },
};
