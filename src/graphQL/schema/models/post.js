const postDef = `
type Post {
    id: Int!
    name: String!
    description: String!
    applicantLimit: Int!
    owner: User!
    state: PostState!
    createdAt: DateTime
}
`;

module.exports = postDef;
