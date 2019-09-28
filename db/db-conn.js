const sequelize = require('sequelize');
const constants = require('../includes/constants');

module.exports = new sequelize(constants.DB.NAME, constants.DB.USERNAME, constants.DB.PASS, {
    host: constants.DB.HOST,
    dialect: 'mysql'
});