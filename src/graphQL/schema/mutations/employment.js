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
`;

module.exports = employmentMutations;
