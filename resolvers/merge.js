const { stringDate } = require("../helpers/stringDate");
const Author = require("../models/author");
const Book = require("../models/book");

const author = (authorId) =>
    Author.findById(authorId)
        .then((author) => transformAuthor(author))
        .catch((err) => {
            throw err;
        });

const books = (authorId) =>
    Book.find({ authorId })
        .then((books) => books.map((book) => transformBook(book)))
        .catch((err) => {
            throw err;
        });

const transformBook = (book) => ({
    ...book._doc,
    id: book.id,
    author: author.bind(this, book._doc.authorId),
    createdAt: stringDate(book._doc.createdAt),
    updatedAt: stringDate(book._doc.updatedAt),
});

const transformAuthor = (author) => ({
    ...author._doc,
    id: author.id,
    books: books.bind(this, author.id),
    createdAt: stringDate(book._doc.createdAt),
    updatedAt: stringDate(book._doc.updatedAt),
});

exports.transformAuthor = transformAuthor;
exports.transformBook = transformBook;
