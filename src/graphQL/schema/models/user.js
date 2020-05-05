const userDef = `
type User {
    id: Int!
    rut: String!
    name: String!
    mail: String!
    phone: String!
    address: String!
    profilePicture: String
    resumeUrl: String
    posts: [Post]
    role: Role!
}
`;

module.exports = userDef;