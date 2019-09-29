const { BaseModel } = include('models/base-model');
const { appConfig } = include('includes/config');

class User extends BaseModel {
    static get tableName() {
        return appConfig.DB.TABLE.USERS;
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_name', 'pass'],
            properties: {
                id: { type: 'integer' },
                user_name: {type: 'string', minLength: 3, maxLength: 60},
                pass: {type: 'string', minLength: 8, maxLength: 60}
            }
        };
    }
}

module.exports = User;