// Import subscriptions definitions
// const subsDef = require('./models/subscriptions');

// Import type definition for each entity
const userDef = require('./models/user');
const roleDef = require('./models/role')

// Strings concatenation
const typesDefs = 
userDef +
roleDef// +
// someDef;

// Import mutations for each entity
const usersMutations = require('./mutations/user');

// Strings concatenation
const mutationsDefs =
  'type Mutation {' +
  usersMutations +
  '}';

// Import queries for each entity
const usersQueries = require('./queries/user');

// Strings concatenation
const queriesDefs =
  'type Query {' +
  usersQueries +
  '}';

// Define the schema as the concatenation of Defs, Subscriptions, Queries and Mutations
const graphqlSchema = typesDefs  + mutationsDefs + queriesDefs // + subsDef;

module.exports = graphqlSchema;