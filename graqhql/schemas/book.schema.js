const directives = require("../directives");
const { authDirectiveTypeDefs } = directives.authDirective("auth");

module.exports = `
${authDirectiveTypeDefs}
type Book {
    id: ID,
    name: String!
    genre: String!
    authorId: String!
    updatedAt: String @auth(requires: admin)
    createdAt: String 
    author:Author 
}

type Query{
    book(id:ID): Book
    books:[Book]
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
}`;
