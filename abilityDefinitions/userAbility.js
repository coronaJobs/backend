const { db } = require('./../src/models')
const {
    UserInputError
} = require('apollo-server')

const userAbility = (ability, currentUser) => {
    if (currentUser) {
        ability.creteAbility(db.user, 'update', async(params) => {
            const { user } = params

            // validations
            if (!(user instanceof db.user)) throw new UserInputError('user: params must contain a valid user instance')

            return currentUser.id == user.id
        })

        ability.creteAbility(db.user, 'delete', async(params) => {
            const { user } = params

            // validations
            if (!(user instanceof db.user)) throw new UserInputError('user: params must contain a valid user instance')

            return currentUser.id == user.id
        })

    }
}