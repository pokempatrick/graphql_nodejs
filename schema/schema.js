const { buildSchema } = require("graphql");

exports.schema = buildSchema(`
    type Book {
        id: ID,
        name: String!
        genre: String!
        authorId: String!
        updatedAt: String
        createdAt: String
        author:Author 
    }
    type Author {
        id: ID,
        name: String!
        updateAt: String
        createAt: String
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
