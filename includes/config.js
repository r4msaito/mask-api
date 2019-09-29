const EnvironmentUtil = require('./environment-util');
let env = EnvironmentUtil.getCurrentEnvironment();

let appConfig = {
    APP_PORT: (function() {
        let port = 3000;
        port = ((env === 'staging') ? 3000 : '') || ((env === 'production') ? 3000 : port);
        return port;
    }()),
    DB: {
        NAME: (function() {
            let name = 'mask_api_engine';
            name = ((env === 'staging') ? 'mask_api_engine' : '') || ((env === 'production') ? 'mask_api_engine' : name);
            return name;
        }()),
        USERNAME: (function() {
            let userName = 'root';
            userName = ((env === 'staging') ? 'root' : '') || ((env === 'production') ? 'root' : userName);
            return userName;
        }()),
        PASS: (function() {
            let pass = '';
            pass = ((env === 'staging') ? '' : '') || ((env === 'production') ? '' : pass);
            return pass;
        }()),
        HOST: (function() {
            let host = 'localhost';
            host = ((env === 'staging') ? 'localhost' : '') || ((env === 'production') ? 'localhost' : host);
            return host;
        }()),
        TABLE: (function() {
            let prefix = 'mskx_';
            return {
                PREFIX: prefix,
                USERS: prefix + 'users',
                POSTS: prefix + 'posts'
            };
        }())
    }
};

module.exports.appConfig = appConfig;