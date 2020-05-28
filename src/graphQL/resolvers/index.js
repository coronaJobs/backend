const { JSONResolver, DateTimeResolver } = require("graphql-scalars");
const user = require("./user");
const post = require("./post");
const auth = require("./auth");
const postState = require("./postState");
const can = require("./can");
const role = require("./role");
const application = require("./application");
const commune = require("./commune");

// Import all the resolvers
const resolvers = {
  JSON: JSONResolver,
  DateTime: DateTimeResolver,
  Query: {},
  Mutation: {},
  Post: post.Post,
  User: user.User,
  PostState: postState.PostState,
  Commune: commune.Commune,
  // Subscription: {},
};

// Assign the queries to the specific object
Object.assign(
  resolvers.Query,
  user.Query,
  post.Query,
  postState.Query,
  can.Query,
  role.Query,
  commune.Query
);

// Assign the mutations to the specific object
Object.assign(
  resolvers.Mutation,
  user.Mutation,
  post.Mutation,
  auth.Mutation,
  application.Mutation
);

// Assign the subscriptions to the specific object
// Object.assign(
//   resolvers.Subscription,
// );

module.exports = resolvers;
