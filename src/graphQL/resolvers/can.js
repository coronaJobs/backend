const { db } = require('../../models');
const {
    UserInputError
} = require('apollo-server')


module.exports = {
  Subscription: {},

  Query: {
    can: async (_, params, ctx) => {
      const {entityName, action, filters} = params

      // validations

      if (!db[entityName]) throw new UserInputError('entityName: must be from a valid entity') 

      const filter = {}

      if (filters) {
        
        // filters valdiations
        for (const canFilter of filters) {
            if (typeof canFilter.name == "undefined") throw new UserInputError('filters: if you pass the filters parameter, name cannot be undefined')
            if (typeof canFilter.id == "undefined") throw new UserInputError('filters: if you pass the filters parameter, id cannot be undefined')
            if (!(typeof canFilter.name == "string")) throw new UserInputError('filters: name must be a String')
            if (!Number.isInteger(canFilter.id)) throw new UserInputError('filters: id must be an Integer')
            if (!db[canFilter.name]) throw new UserInputError('filters: name must be from a valid entity')    
        }

        for (const canFilter of filters) {
            const instance =  await db[canFilter.name.toLowerCase()].findByPk(canFilter.id)
            if (!instance) {
                return false
            }            
            filter[canFilter.name.toLowerCase()] = instance
          } 
      }

      const entity = db[entityName.toLowerCase()]

      try {
        
        const result = await ctx.ability.can(entity, action.toLowerCase(), filter)

        return result

      } catch (error) {
          
          if (!error.extensions) throw error

          if (error.extensions.code == "BAD_USER_INPUT") {
              throw new UserInputError('filters: '+ error.message)
          } else {
              throw error
          }
      }

      
    },
  },
};