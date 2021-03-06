'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    modId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100]
      }
    },
    starter: {
      type: DataTypes.TEXT,
      validate: {isUrl: true},
      allowNull: true
    },
    curriculum: {
      type: DataTypes.TEXT,
      validate: {isUrl: true},
      allowNull: true
    },
    solution: {
      type: DataTypes.TEXT,
      validate: {isUrl: true},
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  });
  Project.associate = function(models) {
    Project.belongsTo(models.Mod, {foreignKey: 'modId'})
    Project.belongsTo(models.Week, {foreignKey: 'weekId'})
    Project.belongsTo(models.Day, {foreignKey: 'dayId'})
    Project.hasMany(models.ProjectLink, {foreignKey: 'projectId', onDelete: 'cascade', hooks: true})
    Project.hasMany(models.ProjectWalkthru, {foreignKey: 'projectId', onDelete: 'cascade', hooks: true})
  };
  return Project;
};