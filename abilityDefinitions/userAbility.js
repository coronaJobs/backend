const { db } = require('./../src/models')
const {
    UserInputError
} = require('apollo-server')

const userAbility = (ability, currentUser) => {
    if (currentUser) {
        ability.createAbility(db.user, 'update', async(params) => {
            const { user } = params

            // validations
            if (!(user instanceof db.user)) throw new UserInputError('user: params must contain a valid user instance')

            return currentUser.id == user.id
        })

        ability.createAbility(db.user, 'delete', async(params) => {
            const { user } = params

            // validations
            if (!(user instanceof db.user)) throw new UserInputError('user: params must contain a valid user instance')

            return currentUser.id == user.id
        })

    }
}

module.exports = { userAbility }