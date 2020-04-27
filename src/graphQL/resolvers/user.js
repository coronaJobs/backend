const { db } = require('../../models');

module.exports = {
  Subscription: {},

  Query: {
    getUsers: async (_, params, ctx) => {
      // check auth!!
      
      // get
      return await db.user.findAll()
    },
  },

  Mutation: {
      createUser: async (_, params, ctx) => {
        // check auth!!
        // get params

        /*
        const {
          rut,
          name,
          mail,
          phone,
          address,
          profilePicture
        } = params
        */

        // validate params
        // you can use validator js library

        // create
        const newUser = await db.user.create(params)
        return newUser
      },
  },
  User: {
    role: async (user) => {
      return await user.getRole({
        where: {
          active: true
        }
      })
    }
  }
};