'use strict'
module.exports = (sequelize, DataTypes) => {
  const postState = sequelize.define('postState', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
  });

  postState.associate = (models) => {
    postState.hasMany(models.post, {
      foreignKey: 'stateId',
      as: 'posts'
    });
  };

  return postState;
};