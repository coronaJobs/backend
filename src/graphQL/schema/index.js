// Import subscriptions definitions
// const subsDef = require('./models/subscriptions');

// Import type definition for each entity
const userDef = require('./models/user');
const postDef = require('./models/post');
const roleDef = require('./models/role');
const postStateDef = require('./models/postState');
const scalarDef = require('./models/scalar')


// Strings concatenation
const typesDefs = 
userDef +
postDef +
roleDef +
postStateDef +
scalarDef
// someDef;

// Import mutations for each entity
const usersMutations = require('./mutations/user');
const postsMutations = require('./mutations/post');
const authMutations = require('./mutations/auth');

// Strings concatenation
const mutationsDefs =
  'type Mutation {' +
  usersMutations +
  postsMutations +
  authMutations +
  '}';

// Import queries for each entity
const usersQueries = require('./queries/user');
const postsQueries = require('./queries/post');
const postStatesQueries = require('./queries/postState');
const canQueries = require('./queries/can');
const rolesQueries = require('./queries/roles');

// Strings concatenation
const queriesDefs =
  'type Query {' +
  usersQueries +
  postsQueries +
  postStatesQueries +
  canQueries +
  rolesQueries +
  '}';

// Define the schema as the concatenation of Defs, Subscriptions, Queries and Mutations
const graphqlSchema = typesDefs  + mutationsDefs + queriesDefs // + subsDef;

module.exports = graphqlSchema;