module.exports = `type Book {
    id: ID,
    name: String!
    genre: String!
    authorId: String!
    updatedAt: String
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
