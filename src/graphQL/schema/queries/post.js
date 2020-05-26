const postsQueries = `
    getAllPosts(text: String, fromDate: String, toDate: String, communeId: [Int], fromApplicantLimit: Int, toApplicantLimit: Int): [Post]
`;

module.exports = postsQueries;
