const { db } = require('../../models');

module.exports = {
  Subscription: {},

  Query: {
    getAllPosts: async (_, params, ctx) => {
        return await db.post.findAll(params)
    },
  },

  Post: {
    owner: async (post, params, ctx) => {
        console.log(post)
        return await post.getOwner()
      },
  },
  
};