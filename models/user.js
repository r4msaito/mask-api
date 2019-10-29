const { BaseModel } = include('models/base-model');
const { config } = include('config/master');
const { Util } = include('includes/util');
const { ErrorLog } = include('models/error-log');
const { BcryptHelper } = include('includes/bcrypt-helper');
const { ValidationError } = require('objection');

class User extends BaseModel {
    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['users'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_name', 'pass'],
            properties: {
                id: { type: 'integer' },
                user_name: { type: 'string', minLength: 3, maxLength: 60 },
                pass: { type: 'string', minLength: 8, maxLength: 60 }
            }
        };
    }

    $beforeInsert(queryContext) {
        let currMySQLDateTime = Util.getCurrMysqlDateTime();
        this.created_at = currMySQLDateTime;
        this.updated_at = currMySQLDateTime;
    }

    $beforeUpdate() {
        this.updated_at = Util.getCurrMysqlDateTime();
    }

    static async findUserByUserName(user_name) {
        return await User.query().where('user_name', user_name);
    }

    static async checkLogin(user_name, pass) {
        return await User.findUserByUserName(User.sanitizeUserName(user_name))
            .then((result) => {
                if (result.length !== 0) {
                    let checkHash = BcryptHelper.checkHash(pass, result.pass);
                    return (checkHash) ? result[0] : false;
                }
            }).catch((err) => {
                let errStr = JSON.stringify(err);
                if (errStr)
                    ErrorLog.logError({
                        error: errStr,
                        file_info: 'user.js checkLogin'
                    });

                return false;
            });
    }

    static sanitizeUserName(user_name) {
        return user_name.replace(/[^A-Za-z0-9_]/g, '');
    }
}

module.exports.User = User;