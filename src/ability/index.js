const { Ability } = require('./ability')
const { db } = require('./../models')

const setAbility = (user) => {
    const ability = new Ability(user)

    if (user) {
        ability.createAbility(db.post, 'update', async ({post}) => {
            const owner = await post.getOwner()
            return owner.id == user.id
        })
    } else {
        
    } 

    return ability
}


module.exports = { setAbility }