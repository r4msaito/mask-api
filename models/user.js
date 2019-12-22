const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');
const { ErrorLogger } = absRequire('models/error-logger');
const { BcryptHelper } = absRequire('core/bcrypt-helper');

class User extends Model {

    static getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['user'];
    }

    schema() {
        return {
            user_name: {
                required: true,
                type: 'string',
                min: 3,
                max: 60
            },
            pass: {
                required: true,
                type: 'string',
                min: 60,
                max: 60
            },
            created_at: {
                required: true,
                type: 'date',
                format: ''
            },
            updated_at: {
                required: true,
                type: 'date',
                format: ''
            }
        }
    }

    columns() {
        return [
            'user_name',
            'pass',
            'created_at',
            'updated_at'
        ];
    }

    beforeInsert() {
        console.log('inside before insert');
        let currMySQLDateTime = Util.getCurrMysqlDateTime();
        this.created_at = currMySQLDateTime;
        this.updated_at = currMySQLDateTime;
    }

    static findUserByUserName(userName) {
        return User.find(['user_name', '=', userName]);
    }

    static async checkLogin(user_name, pass) {
        return await User.findUserByUserName(User.sanitizeUserName(user_name))
            .then(async(result) => {
                if (result.length !== 0) {
                    let checkHash = await BcryptHelper.checkHash(pass, result[0].pass);
                    return (checkHash) ? result[0] : false;
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    static sanitizeUserName(user_name) {
        return user_name.replace(/[^A-Za-z0-9_]/g, '');
    }
}

module.exports.User = User;