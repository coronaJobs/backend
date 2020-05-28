const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int!,
        picture: String,
    ): Post

    deletePostPicture(
        post: ID!
    ): Post
`;

module.exports = postsMutations;
