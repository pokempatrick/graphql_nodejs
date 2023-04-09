const Author = require("../models/author");
const Book = require("../models/book");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} = require("graphql");

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represent a book written by author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            resolve: (book) => Author.findById(book.authorId),
        },
    }),
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represent a author of a book",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => Book.find({ authorId: author.id }),
        },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        book: {
            type: BookType,
            description: "A Single Book",
            args: {
                id: { type: GraphQLID },
            },
            resolve: (parent, args) => Book.findById(args.id),
        },
        author: {
            type: AuthorType,
            description: "A Single Author",
            args: {
                id: { type: GraphQLID },
            },
            resolve: (parent, args) => Author.findById(args.id),
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of all the books",
            resolve: () => Book.find({}),
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all the authors",
            resolve: () => Author.find({}),
        },
    }),
});
const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "Add a book",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                });
                return book.save();
            },
        },
        updateBook: {
            type: BookType,
            description: "update a book",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const book = {
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                };

                return Book.updateOne({ _id: args.id }, { ...book }).then(() =>
                    Book.findById(args.id)
                );
            },
        },
        deleteBook: {
            type: BookType,
            description: "delete a book",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve: (parent, args) => {
                return Book.deleteOne({ _id: args.id }).then(() => ({
                    id: args.id,
                }));
            },
        },
        addAuthor: {
            type: AuthorType,
            description: "Add an Author",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = new Author({
                    name: args.name,
                });
                return author.save();
            },
        },
        updateAuthor: {
            type: AuthorType,
            description: "update a author",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = {
                    name: args.name,
                };

                return Author.updateOne({ _id: args.id }, { ...author }).then(
                    () => Book.findById(args.id)
                );
            },
        },
        deleteAuthor: {
            type: AuthorType,
            description: "delete a author",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve: (parent, args) => {
                return Author.deleteOne({ _id: args.id }).then(() => ({
                    id: args.id,
                }));
            },
        },
    }),
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});
