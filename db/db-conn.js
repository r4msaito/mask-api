const sequelize = require('sequelize');
const constants = require('../includes/constants');

module.exports = new sequelize(constants.DB_NAME, constants.DB_USERNAME, constants.DB_PASS, {
    host: constants.DB_HOST,
    dialect: 'mysql'
});