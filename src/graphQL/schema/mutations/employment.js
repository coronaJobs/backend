const employmentMutations = `
    createEmployment(
        offerId: Int!
        applicantId: Int!
    ): Employment
    
    removeEmployee(
        jobId: Int!
        employeeId: Int!
    ): Boolean
`;

module.exports = employmentMutations;
