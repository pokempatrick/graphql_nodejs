module.exports = /* GraphQL */ `
    type Product {
        id: ID!
        description: String
        price: Int
        client: Client
    }

    type Query {
        products: [Product]
        product(id: ID!): Product
    }
`;
