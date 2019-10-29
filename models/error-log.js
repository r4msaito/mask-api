const { BaseModel } = include('models/base-model');
const { config } = include('config/master');

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

    static async logError(err) {
        return await ErrorLog.query().insert(err);
    }
}

module.exports.ErrorLog = ErrorLog;