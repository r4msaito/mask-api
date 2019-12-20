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

    static validateSchema(schema, model) {
        let valid = true;
        let msg = '';
        let validationResult = {
            valid: valid,
            msg: msg
        };
        let schemaProperties = Object.keys(schema);
        let modelProperties = Object.keys(model);

        if (schemaProperties.length === 0)
            return validationResult;

        if (modelProperties.length === 0) {
            validationResult.valid = false;
            return validationResult;
        }

        for (var i = 0; i < schemaProperties.length; i++) {
            if (!modelProperties.hasOwnProperty(schemaProperties[i])) {
                validationResult.valid = false;
                validationResult.msg = 'Model property ' + schemaProperties[i] + ' does not exist';
                return validationResult;
            }

            if (schema[schemaProperties[i]]['required'] === true && (model[schemaProperties[i]] === undefined || model[schemaProperties[i]] === '')) {
                validationResult.valid = false;
                validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' is required';
                return validationResult;
            }

            if (schema[schemaProperties[i]].hasOwnProperty('type')) {
                if (schema[schemaProperties[i]]['type'] === 'int' && typeof model[schemaProperties[i]] !== 'number') {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' must be an integer';
                    return validationResult;
                } else if (schema[schemaProperties[i]]['type'] === 'string') {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' must be a string';
                    return validationResult;
                }
            }

            if (schema[schemaProperties[i]].hasOwnProperty('min')) {
                if (model[schemaProperties[i]] < schema[schemaProperties[i]]['min']) {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' should be minimum of ' + schema[schemaProperties[i]]['min'];
                    return validationResult;
                }
            }

            if (schema[schemaProperties[i]].hasOwnProperty('max')) {
                if (model[schemaProperties[i]] > schema[schemaProperties[i]]['max']) {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' should be maximum of ' + schema[schemaProperties[i]]['min'];
                    return validationResult;
                }
            }

            if (schema[schemaProperties[i]].hasOwnProperty('minLength')) {
                if (model[schemaProperties[i]].length < schema[schemaProperties[i]]['minLength']) {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' should have minimum length of ' + schema[schemaProperties[i]]['minLength'];
                    return validationResult;
                }
            }

            if (schema[schemaProperties[i]].hasOwnProperty('maxLength')) {
                if (model[schemaProperties[i]].length > schema[schemaProperties[i]]['maxLength']) {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : schema[schemaProperties[i]] + ' should have maximum length of ' + schema[schemaProperties[i]]['maxLength'];
                    return validationResult;
                }
            }

            if (schema[schemaProperties[i]].hasOwnProperty('custom')) {
                if (!schema[schemaProperties[i]].custom(model[schemaProperties[i]])) {
                    validationResult.valid = false;
                    validationResult.msg = (schema[schemaProperties[i]].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['msg'] : 'custom validation error on ' + schema[schemaProperties[i]];
                    return validationResult;
                }
            }

        }

        return validationResult;
    }
}

module.exports.Util = MaskUtil;