const directives = require("../directives");
const { authDirectiveTypeDefs } = directives.authDirective("auth");
module.exports = `
    ${authDirectiveTypeDefs}
    type UserSign {
        email: String
        id: ID
    }
    type User {
        id: ID! 
        role: [String!]
        firstName: String!  
        lastName: String!  
        email: String!
        limitedAccessDate: String  
        updatedDate: String 
        createdDate: String 
        phoneNumber: Int
        imageUrl: String
        user: UserSign
    }

    type UserIndex {
        currentPage : Int
        totalPages : Int
        users : [User!]
    }

    type Query {
        user(id:ID!): User
        users(
            page:Int 
            limit:Int
            firstName: String
        ): UserIndex
    }

    type Mutation {
        addUser( 
            role: [String!]
            email: String!
            firstName: String!  
            lastName: String!  
            limitedAccessDate: String 
            phoneNumber: Int!
        ): User @auth(requires: owner)

        updateUser (
            id:ID!  
            role: [String!]
            firstName: String  
            lastName: String  
            limitedAccessDate: String 
            phoneNumber: Int
        ): User @auth(requires: owner)

        deleteUser(id:ID!): Message @auth(requires: admin)
        
        updatePassword(
            password:String!
        ): Message

        updateLimitAccessDate(
            limitedAccessDate:String!
        ): Message @auth(requires: admin)
    }
    `;
