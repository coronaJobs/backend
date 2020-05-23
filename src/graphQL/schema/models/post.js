const postDef = `
type Post {
    id: Int!
    name: String!
    description: String!
    applicantLimit: Int!
    owner: User!
    state: PostState!
    applicants: [User]
    employees: [User]
    createdAt: DateTime
}
`;

module.exports = postDef;
