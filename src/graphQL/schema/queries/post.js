const postsQueries = `
    getAllPosts(text: String, fromDate: String, toDate: String, communeId: [Int], fromApplicantLimit: Int, toApplicantLimit: Int): [Post]
    getPost(id: Int!): Post
`;

module.exports = postsQueries;
