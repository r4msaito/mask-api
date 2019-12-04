
const moment = require('moment');

class MaskUtil {
    static getCurrentEnvironment() {
        if (process.argv.length) {
            let i;
            for (i = 0; i < process.argv.length; i++) {
                if (process.argv[i] === '--env' && process.argv[i + 1] !== undefined && this.getAllowedEnvironments().includes(process.argv[i + 1]))
                    return process.argv[i + 1];

                return 'development'
            }
        }

        return 'development'
    }

    static getAllowedEnvironments() {
        return [
            'development',
            'staging',
            'production'
        ];
    }

    static die(resp, payload, statusCode) {
        var statusCode = (typeof statusCode === 'undefined') ? 200 : statusCode;
        return resp.status(statusCode).json(payload);
    }

    static getCurrMysqlDateTime() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
    }

    static genFileName() {
        return Date.now();
    }
}

module.exports.Util = MaskUtil;