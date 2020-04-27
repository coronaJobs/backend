const { db } = require('../../models');

module.exports = {
  Subscription: {},

  Query: {
    getPosts: async (_, params, ctx) => {
      // check auth!!
      
      // get
      return await db.post.findAll()
    },
  },

  
};