const postsQueries = `
    getAllPosts(text: String, fromDate: String, toDate: String, ownerId: [Int], fromApplicantLimit: Int, toApplicantLimit: Int): [Post]
`;

module.exports = postsQueries;
