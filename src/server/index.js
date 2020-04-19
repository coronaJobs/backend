const { 
    ApolloServer,
   } = require('apollo-server');
const resolvers = require('../graphQL/resolvers/index');
const typeDefs = require('../graphQL/schema');
const { db } = require('./../models');
  
const app = new ApolloServer({
  typeDefs,
  resolvers,
  onHealthCheck: () => {
    return new Promise((resolve, reject) => {
      // Replace the `true` in this conditional with more specific checks!
      resolve()
    });
  },
  playground: process.env.PLAYGROUND,
  cors: {
    origin: '*'
  },
  formatError: err => {
    console.log(err);
    
    // use this for sentry implementation
    // if (err.extensions.code == 'INTERNAL_SERVER_ERROR') {
    //   Sentry.captureException(err);
    // }
    return err;
  },
  context: async ({ req, connection }) => {
    let finalContext = {}
    // check if user is authenticated. To access headers use req.headers.headername
    // if authenticated (valid token and not in balcklist), get user and save currentUser into finalContext
    // if not, set this
    
    finalContext = { currentUser: null, auth: false, token: null, refreshToken: null };

    // add connection logic for subscriptions
    return finalContext;
  },
});

module.exports = { app };