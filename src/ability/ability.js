class Ability {
    constructor(user) {
        this.user = user
        this.ability = {}
    }

    createAbility(entity, action, filter= async () => true) {
        if (!this.ability[entity.getTableName()]) {
            this.ability[entity.getTableName()] = {}
        }

        this.ability[entity.getTableName()][action] = {filter}
        
    }

    getAbilities () {
        return this.ability
    }

    async can(entity, action, filterParams=undefined) {
        if (this.ability[entity.getTableName()]) {
            if(this.ability[entity.getTableName()][action]) {
                return await this.ability[entity.getTableName()][action].filter(filterParams)
            }
        }
        return false
    }
}

module.exports = {Ability}