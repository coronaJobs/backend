const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int!
    ): Post
`;

module.exports = postsMutations;