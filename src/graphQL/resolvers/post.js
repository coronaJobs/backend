const { db } = require('../../models');

module.exports = {
  Subscription: {},

  Query: {
    getAllPosts: async (_, params, ctx) => {
        return await db.post.findAll(params)
    },
  },

  Mutation: {
    createPost: async (_, params, ctx) => {
      const newPost = await db.post.create(params)
      return newPost
    },
  },

  Post: {
    owner: async (post) => {
        return await post.getOwner()
    },
    state: async (post) => {
      return await post.getState()
    },
  },
  
};