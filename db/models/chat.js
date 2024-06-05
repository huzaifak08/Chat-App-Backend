'use strict';
const {
  Model,DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');

module.exports =sequelize.define('chats',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  },
  icon: {
    type: DataTypes.STRING
  },
  isGroup: {
    type: DataTypes.BOOLEAN
  },
  time: {
    type: DataTypes.TIME
  },
  currentMsg: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
});  