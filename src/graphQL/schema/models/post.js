const postDef = `
type Post {
    id: Int!
    name: String!
    description: String!
    applicantLimit: Int!
    owner: User!
}
`;

module.exports = postDef;