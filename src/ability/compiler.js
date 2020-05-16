const glob = require("glob")
const path = require('path');

const { Ability } = require('./ability')


const getDefinitions = () => {
    const searchPath = 'abilityDefinitions/'
    const relativePath = './../../abilityDefinitions/'
    const definitions = {}

    // get modules
    glob.sync(path.join(searchPath, '*.js')).forEach(element => {
        
        const moduleName = element.split('/').pop().split('.')[0]
        
        const module = require(relativePath + moduleName)
                
        Object.assign(
            definitions,
            module
        )
        
    });
    
    return definitions
}

const compiler = (user) => {
    const definitions = getDefinitions()
    

    const ability = new Ability(user)

    for (const def of Object.values(definitions)) {
        def(ability, user)
    }
    
    return ability
}


module.exports = { compiler }