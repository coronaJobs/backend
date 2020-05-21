const postStateDef = `
type PostState {
    id: Int!
    name: String!
    description: String!
    posts: [Post]
}
`;

module.exports = postStateDef;
