const { BaseModel } = absRequire('models/base-model');
const { config } = absRequire('config/master');
const { DBErrorHandler } = absRequire('includes/db-error-handler');

class ErrorLog extends BaseModel {
    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['error_log'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['error'],
            properties: {
                id: { type: 'integer' },
                error: { type: 'string' },
                file_info: { type: 'string' }
            }
        };
    }

    static logError(err) {
        ErrorLog.query().insert(err).then((result) => {
            return true;
        }).catch((err) => {
            return false;
        });
    }
}

module.exports.ErrorLogger = ErrorLog;