const postDef = `
type Post {
    id: Int!
    name: String!
    description: String!
    applicantLimit: Int!
    owner: User!
    state: PostState!
    picture: String
    applicants: [User]
    employees: [User]
    commune: Commune
    createdAt: DateTime
}
`;

module.exports = postDef;
