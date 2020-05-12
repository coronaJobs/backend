const { db } = require('../../models');

module.exports = {
    Subscription: {},

    Query: {
        getRoles: async (_, params, ctx) => {
            return await db.role.findAll()
        },
    },
};