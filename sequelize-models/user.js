const sequelize = require('sequelize');
const dbConn = require('../db/db-conn');
const constants = require('../includes/constants');
const BaseModelSequelize = require('./base-model');

class User extends BaseModelSequelize {
    static model() {
        return dbConn.define(constants.DB.TABLE.PREFIX + constants.DB.TABLE.USERS, {
            id: {
                type: sequelize.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            user_name: {
                type: sequelize.STRING(60),
                unique: { val: true, msg: 'user_name must be unique' },
                allowNull: false,
                validate: {
                    notNull: { val: true, msg: 'user_name cannot be null' },
                    notEmpty: { val: false, msg: 'user_name cannot be empty' },
                    len: { args: [3, 50], msg: 'user_name must be atleast 3 characters in length and 50 at max' }
                }
            },
            pass: {
                type: sequelize.CHAR(60),
                allowNull: true,
                validate: {
                    notNull: false,
                    len: { args: [60, 60], msg: 'pass should be 60 characters' }
                }
            },
            acc_token: {
                type: sequelize.CHAR,
                unique: { val: true, msg: 'acc_token must be unique' },
                allowNull: true,
                validate: {
                    notNull: false,
                    isAlphanumeric: true,
                    len: { args: [128, 128], msg: 'user_name should be 128 characters' }
                }
            },
            acc_token_expiry: {
                type: sequelize.INTEGER(11).UNSIGNED,
                allowNull: true,
                validate: {
                    notNull: false,
                    isInt: { val: true, msg: 'acc_token_expiry must be a number' }
                }
            },
            last_login: {
                type: sequelize.INTEGER(11).UNSIGNED,
                allowNull: true,
                validate: {
                    notNull: false,
                    isInt: { val: true, msg: 'last_login must be a number' }
                }
            },
            createdAt: {
                type: sequelize.DATE,
                defaultValue: sequelize.NOW,
                allowNull: false
            }
        }, {
            underscored: true,
            timestamps: true
        });
    }
}

module.exports = User;