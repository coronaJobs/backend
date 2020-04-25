'use strict'
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
      rut: DataTypes.INTEGER,
      name: DataTypes.STRING,
      mail: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      resumeUrl: DataTypes.STRING,
      active: {type: DataTypes.BOOLEAN, defaultValue: true},
    });
    return user;
  };