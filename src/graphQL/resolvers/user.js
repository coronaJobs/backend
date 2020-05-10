const { db } = require('../../models');

module.exports = {
  Subscription: {},

  Query: {
    getUsers: async (_, params, ctx) => {
      // check auth!!
      
      // get
      return await db.user.findAll()
    },

    getUser: async (_, { id }, ctx) => {
      return await db.user.findByPk(id)
    }
  },

  Mutation: {
    createUser: async (_, params, ctx) => {
      // check auth!!
      // get params

      // validate params
      // you can use validator js library

      // create
      const newUser = await db.user.create(params)
      return newUser
    },

    editUser: async (_, params, ctx) => {
      // check auth!!
      // get params

      // validate params
      // you can use validator js library

      const editedUser = await db.user.update(params)
      return editedUser
    },
  },

  User: {
    posts: async (user) => {
      return await user.getPosts()
    },
    role: async (user) => {
      return await user.getRole({
        where: {
          active: true
        }
      })
    },
  },
};