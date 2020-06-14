'use_strict'
module.exports = (sequelize, DataTypes) => {
  const evaluation = sequelize.define('evaluation', {
    comment:  DataTypes.STRING,
    score: DataTypes.INTEGER,
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
  });

  evaluation.associate = models => {
    evaluation.belongsTo(models.user, {
      foreignKey: 'empoyeeId',
      as: 'employee',
    });
    evaluation.belongsTo(models.post, {
      foreignKey: 'postId',
      as: 'post',
    });
  };
  
  return evaluation;
};