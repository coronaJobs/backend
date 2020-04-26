'use strict'
module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('role', {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      active: {type: DataTypes.BOOLEAN, defaultValue: true},
    });

    role.associate = (models) => {
        role.hasMany(models.user)
      }

    return role;
  };