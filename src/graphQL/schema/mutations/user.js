const usersMutations = `
    createUser(
        rut: String!,
        name: String!,
        mail: String!,
        password: String!,
        phone: String!,
        address: String!,
        profilePicture: String,
        resumeUrl: String,
        roleId: Int!,
    ): User
    
    editUser(
        id: ID!
        rut: String,
        name: String,
        mail: String,
        phone: String,
        address: String,
        profilePicture: String,
        resumeUrl: String,
    ): User

    profilePictureUploadError: User

    resumeUploadError: User
`;

module.exports = usersMutations;
