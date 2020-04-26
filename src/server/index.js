const { 
    ApolloServer,
    AuthenticationError,
   } = require('apollo-server');
const resolvers = require('../graphQL/resolvers/index');
const typeDefs = require('../graphQL/schema');
const { db } = require('./../models');
const jwt = require('jsonwebtoken');

  
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
    let finalContext;
    
    if (connection) finalContext = connection.context;
    else {
      if (!req.headers.authorization)
        finalContext = { currentUser: null, auth: false, token: null };
      else {
        const user = await jwt.verify(
          req.headers.authorization,
          process.env.JWT_KEY,
          async (err, res) => {
            if (err) {
              throw new AuthenticationError('Invalid Token');
            } else {
              return await db.user.findOne({
                where: { id: res.id, active: true },
              });
            }
          }
        );

        if (!user) throw new AuthenticationError('Invalid Token');

        // if (
        //   await db.blacklist.count({
        //     where: { token: req.headers.authorization },
        //   })
        // ) {
        //   throw new AuthenticationError('Invalid Token');
        // }

        // The token passed all the validations
        finalContext = {
          currentUser: user,
          auth: true,
          token: req.headers.authorization,
        };
      }
    }

    return finalContext;
  },
});

module.exports = { app };