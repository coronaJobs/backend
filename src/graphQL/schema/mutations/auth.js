const authMutations = `
    login(mail: String!, password: String!): String
    logout: Boolean
`;

module.exports = authMutations;
