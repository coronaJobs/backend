const { db } = require("../../models");
const { ForbiddenError } = require("apollo-server");

module.exports = {
  Subscription: {},

  Query: {
    getCommunes: async (_, params, ctx) => {
      const userCanReadCommunes = await ctx.ability.can(db.commune, "read");
      if (userCanReadCommunes) {
        return await db.commune.findAll();
      } else {
        throw new ForbiddenError("User must be logged");
      }
    },
  },

  Commune: {
    posts: async (commune) => {
      return await commune.getPosts({ where: { active: true } });
    },
  },
};
