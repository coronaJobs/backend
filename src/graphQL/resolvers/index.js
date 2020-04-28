const user = require('./user');
const post = require('./post');
const auth = require('./auth');

// Import all the resolvers
const resolvers = {
  Query: {},
  Mutation: {},
  Post: post.Post,
  User: user.User,
  // Subscription: {},
};

// Assign the queries to the specific object
Object.assign(
  resolvers.Query,
  user.Query,
  post.Query,
);

// Assign the mutations to the specific object
Object.assign(
  resolvers.Mutation,
  user.Mutation,
  post.Mutation,
  auth.Mutation,
);

// Assign the subscriptions to the specific object
// Object.assign(
//   resolvers.Subscription,
// );

module.exports = resolvers;