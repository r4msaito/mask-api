const { Util } = require('../includes/util');
const { constants } = require('../includes/constants');

module.exports.config = (function () {
    let currEnv = Util.getCurrentEnvironment();
    let uploadsPath = './uploads/';
    let config = {
        db: {
            name: 'mask_api_engine',
            table_prefix: 'mskx_',
            table: {
                users: 'users',
                posts: 'posts',
                posts_cat: 'posts_cat',
                posts_cat_rel: 'posts_cat_rel',
                user_post_cat_rel: 'user_post_cat_rel',
                error_log: 'error_log',
            }
        },
        dp_uploads_path: uploadsPath + 'dp/'
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