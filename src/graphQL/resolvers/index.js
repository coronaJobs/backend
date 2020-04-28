const message = require('./message');
const user = require('./user');
const post = require('./post');

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
  message.Query,
  user.Query,
  post.Query,
);

// Assign the mutations to the specific object
Object.assign(
  resolvers.Mutation,
  message.Mutation,
  user.Mutation,
  post.Mutation,
);

// Assign the subscriptions to the specific object
// Object.assign(
//   resolvers.Subscription,
//   message.Subscription,
// );

module.exports = resolvers;