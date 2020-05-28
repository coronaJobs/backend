const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int,
        communeId: Int!,
        picture: String,
    ): Post
`;

module.exports = postsMutations;
