const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int,
        communeId: Int!,
        picture: String,
    ): Post

    deletePostPicture(
        postId: ID!
    ): Post
`;

module.exports = postsMutations;
