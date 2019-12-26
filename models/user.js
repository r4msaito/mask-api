const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');
const { ErrorLogger } = absRequire('models/error-logger');
const { BcryptHelper } = absRequire('core/bcrypt-helper');

class User extends Model {
    
    static getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['user'];
    }

    static schema() {
        return {
            user_name: {
                required: true,
                type: 'string',
                min: 3,
                max: 60,
                custom: {
                    f: (val) => {
                        var rgx = /[^A-Za-z0-9_]/g;
                        if (rgx.test(val))
                            return false

                        return true;
                    },
                    msg: 'user_name must contain proper characters'
                }
            },
            pass: {
                required: true,
                type: 'string',
                min: 60,
                max: 60
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
        let currMySQLDateTime = Util.getCurrMysqlDateTime();
        this.created_at = currMySQLDateTime;
        this.updated_at = currMySQLDateTime;
    }

    beforeUpdate() {
        this.updated_at = Util.getCurrMysqlDateTime();
    }

    static findUserByUserName(userName) {
        return this.find(['user_name', '=', userName]);
    }

    static tryLoggingIn(userName, pass) {
        return this.findUserByUserName(User.sanitizeUserName(userName), pass).then((result) => {
            if (result.length > 0) {
                return BcryptHelper.checkHash(pass, result[0].pass).then((hashCheck) => {
                    return (hashCheck) ? result[0] : false;
                }).catch((hashCheckErr) => {
                    console.log(hashCheckErr);
                    return false;
                });
            }
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }

    static sanitizeUserName(userName) {
        return userName.replace(/[^A-Za-z0-9_]/g, '');
    }
}

module.exports.User = User;