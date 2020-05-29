const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int,
        communeId: Int!,
        picture: String,
    ): Post

    postPictureUploadError(
        postId: ID!
    ): Post
`;

module.exports = postsMutations;
