const postsMutations = `
    createPost(
        name: String!,
        description: String!,
        applicantLimit: Int!,
        ownerId: Int!
    ): Post

    createApplication(
        offerId: Int!
    ): Application
`;

module.exports = postsMutations;
