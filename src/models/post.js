'use strict'
module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      applicantLimit: DataTypes.INTEGER,
      active: {type: DataTypes.BOOLEAN, defaultValue: true},
    });

    post.associate = models => {
      post.belongsTo(models.user, {
        foreignKey: 'ownerId',
        as: 'owner'});
    };

    return post;
  };