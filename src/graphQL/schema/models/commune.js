const communeDef = `
type Commune {
    id: Int!
    name: String!
    
    posts: [Post]
}
`;

module.exports = communeDef;
