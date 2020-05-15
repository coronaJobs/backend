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

    async can(entity, action, filterParams={}) {
        const table = this.ability[entity.getTableName()]
        const entityAction = table ? table[action] : null
        if(entityAction) {
            return await entityAction(filterParams)
        }
        return false
    }
}

module.exports = {Ability}