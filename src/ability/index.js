const { Ability } = require('./ability')
const { db } = require('./../models')
const {
    ApolloError,
  } = require('apollo-server');

const setAbility = (user) => {
    const ability = new Ability(user)

    if (user) {
        ability.createAbility(db.post, 'update', async ({post}) => {
            const owner = await post.getOwner()
            return owner.id == user.id
        })
    } else {
        throw new ApolloError('User not found', 404)
    } 

    return ability
}


module.exports = { setAbility }