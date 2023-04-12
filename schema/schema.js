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
    buildSchema,
} = require("graphql");

/* const BookType = new GraphQLObjectType({
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
}); */

exports.schema = buildSchema(`
    type Book {
        id: ID,
        name: String!
        genre: String!
        authorId: String!
        author:Author 
    }
    type Author {
        id: ID,
        name: String!
        books:[Book!]
    }
    type Message {message:String!}
    
    type Query{
        book(id:ID): Book
        books:[Book]
        author(id:ID): Author
        authors:[Author!]
    }

    type Mutation{
        addBook(
            name: String!
            genre: String!
            authorId: String!
            ): Book
        updateBook(
            id:ID! 
            name: String
            genre: String
            authorId: String
            ): Book
        deleteBook(id:ID!): Message
        addAuthor( name: String!): Author
        updateAuthor(id:ID!  name: String!): Author
        deleteAuthor(id:ID!): Message

    }
`);

const author = (authorId) =>
    Author.findById(authorId)
        .then((author) => ({
            ...author._doc,
            id: author.id,
            books: books.bind(this, author.id),
        }))
        .catch((err) => {
            throw err;
        });

const books = (authorId) =>
    Book.find({ authorId })
        .then((books) =>
            books.map((book) => ({
                ...book._doc,
                id: book.id,
                author: author.bind(this, book._doc.authorId),
            }))
        )
        .catch((err) => {
            throw err;
        });

exports.root = {
    // book resolvers

    // query
    books: () =>
        Book.find({}).then((books) =>
            books.map((book) => ({
                ...book._doc,
                id: book.id,
                author: author.bind(this, book._doc.authorId),
            }))
        ),
    book: (args) =>
        Book.findById(args.id).then((book) => ({
            ...book._doc,
            id: book.id,
            author: author.bind(this, book._doc.authorId),
        })),

    // mutation
    addBook: ({ genre, authorId, name }) =>
        new Book({
            name,
            genre,
            authorId,
        })
            .save()
            .then((book) => ({
                ...book._doc,
                id: book.id,
                author: author.bind(this, book._doc.authorId),
            })),

    updateBook: (book) => {
        return Book.updateOne({ _id: book.id }, { ...book }).then(() =>
            Book.findById(args.id).then((book) => ({
                ...book._doc,
                id: book.id,
                author: author.bind(this, book._doc.authorId),
            }))
        );
    },
    deleteBook: ({ id }) => {
        return Book.deleteOne({ _id: id }).then(() => ({
            message: `Object ${id} deleted`,
        }));
    },

    // author resolvers

    // queries
    author: (args) =>
        Author.findById(args.id).then((author) => ({
            ...author._doc,
            id: author.id,
            books: books.bind(this, author.id),
        })),
    authors: () =>
        Author.find({}).then((authors) =>
            authors.map((author) => ({
                ...author._doc,
                id: author.id,
                books: books.bind(this, author.id),
            }))
        ),

    // mutation
    addAuthor: ({ name }) =>
        new Author({
            name,
        })
            .save()
            .then((author) => ({
                ...author._doc,
                id: author.id,
                books: books.bind(this, author.id),
            })),

    updateAuthor: (author) => {
        return Author.updateOne({ _id: author.id }, { ...author }).then(() =>
            Author.findById(args.id).then((author) => ({
                ...author._doc,
                id: author.id,
                books: books.bind(this, author.id),
            }))
        );
    },
    deleteAuthor: ({ id }) => {
        return Author.deleteOne({ _id: id }).then(() => ({
            message: `Object ${id} deleted`,
        }));
    },
};
