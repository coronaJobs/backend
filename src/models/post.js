'use strict'
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('post', {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      applicantLimit: DataTypes.INTEGER,
      active: {type: DataTypes.BOOLEAN, defaultValue: true},
      ownerId: DataTypes.INTEGER,
    });
    return user;
  };