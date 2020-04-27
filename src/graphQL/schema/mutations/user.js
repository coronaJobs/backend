const usersMutations = `
    createUser(
        rut: String!,
        name: String!,
        mail: String!,
        phone: String!,
        address: String!,
        profilePicture: String,
        resumeUrl: String): User
`;

module.exports = usersMutations;
