const { Util } = require('../core/util');
const { constants } = require('../core/constants');

module.exports.config = (function () {
    let currEnv = Util.$getCurrentEnvironment();
    let uploadsPath = './uploads/';
    let config = {
        db: {
            name: 'mask_api_engine',
            table_prefix: 'mskx_',
            table: {
                user: 'user',
                story: 'story',
                tax: 'tax',
                tax_terms: 'tax_terms',
                story_terms: 'story_terms',
                story_comment: 'story_comment',
                entity_reaction: 'entity_reaction',
                story_share_log: 'story_share_log',
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