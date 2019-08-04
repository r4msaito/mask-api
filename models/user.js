const sequelize = require('sequelize');
const dbConn = require('../db/db-conn');
const constants = require('../includes/constants');

module.exports = dbConn.define(constants.DB_TABLE_PREFIX + constants.DB_USERS_TABLE, {
    id: {
        type: sequelize.INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: sequelize.STRING(60),
        allowNull: false,
        validate: {
            isAlpha: true,
            notNull: true
        }
    },
    last_name: {
        type: sequelize.STRING(60),
        allowNull: false,
        validate: {
            isAlpha: true,
            notNull: true
        }
    },
    user_name: {
        type: sequelize.STRING(60),
        unique: true,
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            notNull: true
        }
    },
    pass: {
        type: sequelize.TEXT,
        validate: {
            isNull: true,
            isAlphanumeric: true
        }
    },
    acc_token: {
        type: sequelize.CHAR,
        validate: {
            isNull: true,
            isAlphanumeric: true,
            max: 128,
            min: 128
        }
    },
    acc_token_expiry: {
        type: sequelize.INTEGER(11).UNSIGNED,
        validate: {
            isNull: true,
            isInt: true
        }
    },
    last_login: {
        type: sequelize.INTEGER(11).UNSIGNED,
        validate: {
            isNull: true,
            isInt: true
        }
    },
}, {
    underscored: true,
    timestamps: true
});