module.exports = `
type Author {
    id: ID,
    name: String!
    updateAt: String
    createAt: String
    books:[Book!]
}
type Message {message:String!}

type Query{
    author(id:ID): Author
    authors:[Author!]
}

type Mutation{
    addAuthor( name: String!): Author
    updateAuthor(id:ID!  name: String!): Author
    deleteAuthor(id:ID!): Message
}`;
