const { db } = require('../../models');

module.exports = {
  Subscription: {},

  Query: {
    getAllPostStates: async (_, params, ctx) => {
      return await db.postState.findAll(params)
    },
  },

  PostState: {
    posts: async (postState) => {
      return await postState.getPosts()
    },
  },
  
};