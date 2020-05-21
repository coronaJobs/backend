const validators = {}

Object.assign(
    validators,
    require('./validateUserParameters'),
    require('./validatePostSearchParameters'),
)

module.exports = validators