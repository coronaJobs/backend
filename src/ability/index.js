const { compiler } = require('./compiler')

const setAbility = (user) => {
    
    const ability = compiler(user)

    return ability
}


module.exports = { setAbility }