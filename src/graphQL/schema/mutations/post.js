const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int,
        communeId: Int!
    ): Post
`;

module.exports = postsMutations;
