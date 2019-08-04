const sequelize = require('sequelize');
const dbConn = require('../db/db-conn');
const constants = require('../includes/constants');

module.exports = dbConn.define(constants.DB_TABLE_PREFIX + constants.DB_POSTS_TABLE, {
    id: {
        type: sequelize.INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: sequelize.TEXT,
        allowNull: false,
        validate: {
            isAlpha: true,
            notNull: true
        }
    },
    excerpt: {
        type: sequelize.TEXT,
        allowNull: true,
        validate: {
            isAlpha: true,
            notNull: false
        }
    },
    hashtags: {
        type: sequelize.TEXT,
        allowNull: true,
        validate: {
            isAlpha: true,
            notNull: false
        }
    }
}, {
    underscored: true,
    timestamps: true
});