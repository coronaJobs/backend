class Ability {
    constructor(user) {
        this.user = user
        this.ability = {}
    }

    createAbility(entity, action, filter= async () => true) {
        if (!this.ability[entity.getTableName()]) {
            this.ability[entity.getTableName()] = {}
        }

        this.ability[entity.getTableName()][action] = filter
        
    }

    getAbilities () {
        return this.ability
    }

    async can(entity, action, filterParams=undefined) {
        table = this.ability[entity.getTableName()]
        entityAction = table ? table[action] : none
        if(entityAction) {
            return await entityAction(filterParams)
        }
        return false
    }
}

module.exports = {Ability}