'use strict'
module.exports = (sequelize, DataTypes) => {
    const blacklist = sequelize.define('blacklist', {
      token: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    });
    return blacklist;
  };