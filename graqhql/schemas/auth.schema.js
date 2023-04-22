module.exports = `
    type UserAuth {
        userId: String
        userRole: String
        token: String
        message: String
    }

    type Query {
        login(
            email:String! 
            password: String!
        ): UserAuth

        sendCode(
            email:String! 
        ): UserAuth

        checkCode(
            code:String! 
        ): UserAuth
    }
    `;
