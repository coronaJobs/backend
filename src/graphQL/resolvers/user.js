const { db } = require('../../models');
const {
    AuthenticationError,
    UserInputError,
    ForbiddenError,
  } = require('apollo-server');
const validator = require('validator');
const { validateRut,
        formatRut,
        RutFormat } = require('@fdograph/rut-utilities');

function validateParameters(params) {
  const { mail, phone, rut } = params;
  const validationErrors = {}
  if (mail && !validator.isEmail(mail)) {
    validationErrors.mail = 'Invalid email address';
  }
  if (phone && !validator.isNumeric(phone)) {
    validationErrors.phone = 'Invalid phone number';
  }
  if (rut && !validateRut(rut)) {
    validationErrors.rut = 'Invalid rut number';
  }
  else if (rut && validateRut(rut)) {
    params.rut = formatRut(rut, RutFormat.DOTS_DASH);
  }

  if ((Object.keys(validationErrors)).length) {
    throw new UserInputError(
      'Failed to save data due to validation errors',
      { validationErrors }
    ); 
  }
}

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
      validateParameters(params);
      try {
        return await db.user.create(params);
      } catch (error) {
        throw new ApolloError('Unexpected error', 500);
      } 
    },

    editUser: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError('Not authenticated');
      }
      if (ctx.currentUser.id != params.id) {
        throw new ForbiddenError('Not authorized');
      }
      validateParameters(params);
      try {
        const editedUser = await db.user.findByPk(params.id)
        return await editedUser.update(params);

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