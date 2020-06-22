const employmentMutations = `
    createEmployment(
        offerId: Int!
        applicantId: Int!
    ): Employment
    
    removeEmployee(
        jobId: Int!
        employeeId: Int!
    ): Boolean

    cancelJob(
        jobId: Int!
    ): Boolean

    finishJob(
        jobId: Int!
    ): Boolean

    initializeJob(
        jobId: Int!
    ): Boolean

    markEmploymentAsPaid(
        jobId: Int!
    ): Boolean

    payJob(
        jobId: Int!
    ): Boolean
`;

module.exports = employmentMutations;
