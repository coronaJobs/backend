'use strict'
module.exports = (sequelize, DataTypes) => {
  const application = sequelize.define('application', {
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  });

  return application;
};