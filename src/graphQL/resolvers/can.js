const { db } = require('../../models');


module.exports = {
  Subscription: {},

  Query: {
    can: async (_, params, ctx) => {
      const {entityName, action, filters} = params
    
      const entity = db[entityName.toLowerCase()]

      const filter = {}

      if (filters) {
        for (const canFilter of filters) {
            const instance =  await db[canFilter.name.toLowerCase()].findByPk(canFilter.id)
    
            if (!instance) {
                return false
            }
    
            filter[canFilter.name.toLowerCase()] = instance
          } 
      }
           

      return await ctx.ability.can(entity, action.toLowerCase(), filter)
    },
  },
};