const { BaseModel } = absRequire('models/base-model');
const { config } = absRequire('config/master');
const { Util } = absRequire('includes/util');
const { ErrorLogger } = absRequire('models/error-log');
const { BcryptHelper } = absRequire('includes/bcrypt-helper');
const { ValidationError } = require('objection');

class User extends BaseModel {

    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['user'];
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

    $beforeInsert() {
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
            .then(async (result) => {
                if (result.length !== 0) {
                    let checkHash = await BcryptHelper.checkHash(pass, result[0].pass);
                    return (checkHash) ? result[0] : false;
                }
            }).catch((err) => {
                let errStr = DBErrorHandler.getSafeErrorMessage(err);
                if (errStr)
                    ErrorLogger.logError({
                        error: errStr,
                        file_info: 'user.js checkLogin'
                    });

                return false;
            });
    }

    static sanitizeUserName(user_name) {
        return user_name.replace(/[^A-Za-z0-9_]/g, '');
    }

    static getAllowedDPExt() {
        return [
            'image/jpeg',
            'image/png'
        ];
    }

    static validateDP(file) {
        if (file.size > User.DPMaxSize)
            return false;
        
        if (!User.getAllowedDPExt().includes(file.type))
            return false;

        return true;
    }
}

User.DPMaxSize = 3500;

module.exports.User = User;