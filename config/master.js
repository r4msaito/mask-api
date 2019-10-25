const { Util } = require('../includes/util');
const { constants } = require('../includes/constants');

module.exports.config = (function () {
    let currEnv = Util.getCurrentEnvironment();
    let config = {
        db: {
            name: 'mask_api_engine',
            table: {
                prefix: 'mskx_',
                users: 'users',
                posts: 'posts'
            }
        }
    };

    if (currEnv === constants.ENV_DEV) {
        config.app_port = 3000;
        config.db.username = 'root';
        config.db.pass = '';
        config.db.host = 'localhost';
    } else if (currEnv === constants.ENV_STAGING) {
        config.app_port = 3000;
        config.db.username = 'root';
        config.db.pass = '';
        config.db.host = 'localhost';
    } else if (currEnv === constants.ENV_PROD) {
        config.app_port = 3000;
        config.db.username = 'root';
        config.db.pass = '';
        config.db.host = 'localhost';
    }

    return config;
}());