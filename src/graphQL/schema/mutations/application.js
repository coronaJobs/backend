const applicationMutations = `
    createApplication(
        offerId: Int!
    ): Application

    cancelApplication(
        offerId: Int!
    ): Boolean
`;

module.exports = applicationMutations;