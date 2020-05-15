const { db } = require('../../models');
const {
    AuthenticationError,
    ValidationError,
    ForbiddenError,
  } = require('apollo-server');
var validator = require('validator');

module.exports = {
  Subscription: {},

  Query: {
    getUsers: async (_, params, ctx) => {
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
      if (!ctx.auth) {
        throw new AuthenticationError('Not authenticated')
      }
      if (ctx.currentUser.id != params.id) {
        throw new ForbiddenError('Not authorized')
      }
      const { mail, phone } = params;
      console.log(mail)
      if (mail && !validator.isEmail(mail)) {
        throw new ValidationError('Invalid email address')
      }
      // validate params
      // you can use validator js library
      try {
        const editedUser = await db.user.findByPk(params.id)
        return await editedUser.update(params)

      } catch (error) {
        throw new ApolloError('Unexpected error', 500);
      }      
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