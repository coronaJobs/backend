const message = require('./message');
const user = require('./user');

// Import all the resolvers
const resolvers = {
  Query: {},
  Mutation: {},
  // Subscription: {},
};

// Assign the queries to the specific object
Object.assign(
  resolvers.Query,
  message.Query,
  user.Query,
);

// Assign the mutations to the specific object
Object.assign(
  resolvers.Mutation,
  message.Mutation,
  user.Mutation,
);

// Assign the subscriptions to the specific object
// Object.assign(
//   resolvers.Subscription,
//   message.Subscription,
// );

module.exports = resolvers;