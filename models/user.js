const { Model } = absRequire('code/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('includes/util');
const { ErrorLogger } = absRequire('models/error-log');
const { BcryptHelper } = absRequire('includes/bcrypt-helper');

class User extends Model {

    static getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['user'];
    }

    schema() {

    }

    columns() {
        [
            'user_name',
            'pass',
            'created_at',
            'updated_at'
        ];
    }

    static async checkLogin(user_name, pass) {
        return await User.findUserByUserName(User.sanitizeUserName(user_name))
            .then(async(result) => {
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
}

module.exports.User = User;