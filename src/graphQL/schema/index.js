// Import subscriptions definitions
// const subsDef = require('./models/subscriptions');

// Import type definition for each entity
const messageDef = require('./models/message');
const userDef = require('./models/user');

// Strings concatenation
const typesDefs = 
messageDef +
userDef// +
// someDef;

// Import mutations for each entity
const messagesMutations = require('./mutations/message');
const usersMutations = require('./mutations/user');
const authMutations = require('./mutations/auth');

// Strings concatenation
const mutationsDefs =
  'type Mutation {' +
  messagesMutations +
  usersMutations +
  authMutations +
  '}';

// Import queries for each entity
const messagesQueries = require('./queries/message');
const usersQueries = require('./queries/user');

// Strings concatenation
const queriesDefs =
  'type Query {' +
  messagesQueries +
  usersQueries +
  '}';

// Define the schema as the concatenation of Defs, Subscriptions, Queries and Mutations
const graphqlSchema = typesDefs  + mutationsDefs + queriesDefs // + subsDef;

module.exports = graphqlSchema;