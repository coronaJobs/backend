const employmentMutations = `
    createEmployment(
        offerId: Int!
        applicantId: Int!
    ): Employment
`;

module.exports = employmentMutations;
