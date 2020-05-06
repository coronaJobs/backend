const { db } = require('./../src/models')

const postAbility = (ability, user) => {
    if (user) {
        ability.createAbility(db.post, 'update', async ({post}) => {
            const owner = await post.getOwner()
            return owner.id == user.id
        })
    } 
}

module.exports = { postAbility }