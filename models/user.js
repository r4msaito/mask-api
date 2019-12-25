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
        // return await User.findUserByUserName(User.sanitizeUserName(user_name))
        //     .then(async(result) => {
        //         if (result.length !== 0) {
        //             let checkHash = await BcryptHelper.checkHash(pass, result[0].pass);
        //             return (checkHash) ? result[0] : false;
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     });

        return this.findUserByUserName(User.sanitizeUserName(userName), pass).then((result) => {
            console.log('inside result');
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }

    static sanitizeUserName(userName) {
        return userName.replace(/[^A-Za-z0-9_]/g, '');
    }
}

module.exports.User = User;