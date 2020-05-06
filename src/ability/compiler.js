const { Ability } = require('./ability')
const definitions = require('./definitions')

const compiler = (user) => {
    const ability = new Ability(user)

    Object.values(definitions).forEach((def) => {
        def(ability, user)
    })
    
    return ability
}


module.exports = { compiler }