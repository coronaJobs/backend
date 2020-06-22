const employmentDef = `
type Employment {
    employeeId: Int!
    jobId: Int!
    paid: Boolean!
    employeeRating: Int
    employeeComment: String
    employerRating: Int
    employerComment: String
}
`;

module.exports = employmentDef;
