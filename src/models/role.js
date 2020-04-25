'use strict'
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('role', {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      active: {type: DataTypes.BOOLEAN, defaultValue: true},
    });
    return user;
  };