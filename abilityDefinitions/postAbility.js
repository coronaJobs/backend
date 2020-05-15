const { db } = require('./../src/models')
const {
    UserInputError
} = require('apollo-server')


const postAbility = (ability, user) => {
    if (user) {
        ability.createAbility(db.post, 'update', async (params) => {
            const { post } = params
            // validations
            if (!(post instanceof db.post)) throw new UserInputError('post: params must have a valid post instance')
            
            const owner = await post.getOwner()
            return owner.id == user.id
        })
    } 
}

module.exports = { postAbility }