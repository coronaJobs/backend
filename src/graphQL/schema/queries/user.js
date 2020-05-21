const usersQueries = `
    getUsers: [User]
    getUser(id: Int!): User
    getCurrentUser: User
`;

module.exports = usersQueries;
