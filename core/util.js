const moment = require('moment');

class MaskUtil {
    static $getCurrentEnvironment() {
        if (process.argv.length) {
            let i;
            for (i = 0; i < process.argv.length; i++) {
                if (process.argv[i] === '--env' && process.argv[i + 1] !== undefined && MaskUtil.$getAllowedEnvironments().includes(process.argv[i + 1]))
                    return process.argv[i + 1];

                return 'development'
            }
        }

        return 'development'
    }

    static $getAllowedEnvironments() {
        return [
            'development',
            'staging',
            'production'
        ];
    }

    static $die(resp, payload, statusCode) {
        var statusCode = (typeof statusCode === 'undefined') ? 200 : statusCode;
        return resp.status(statusCode).json(payload);
    }

    static $getCurrMysqlDateTime() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
    }

    static $validateSchema(schema, model) {
        let schemaProperties = Object.keys(schema);
        let modelProperties = Object.keys(model);

        if (schemaProperties.length === 0 || modelProperties.length === 0)
            return MaskUtil.$_returnValidationResult(true, '');

        for (var i = 0; i < schemaProperties.length; i++) {
            if (!modelProperties.includes(schemaProperties[i]))
                return MaskUtil.$_returnValidationResult(false, 'Model property ' + schemaProperties[i] + ' does not exist');

            if (schema[schemaProperties[i]].hasOwnProperty('required')) {
                let requiredValid = true;
                let requiredValidMsg = '';

                if (typeof schema[schemaProperties[i]]['required'] === 'boolean' &&
                    schema[schemaProperties[i]]['required'] === true &&
                    (model[schemaProperties[i]] === undefined || model[schemaProperties[i]] === '')) {
                    requiredValid = false;
                    requiredValidMsg = schemaProperties[i] + ' is required';
                } else if (typeof schema[schemaProperties[i]]['required'] === 'object' &&
                    schema[schemaProperties[i]]['required']['value'] === true &&
                    schema[schemaProperties[i]]['required'].hasOwnProperty('msg') &&
                    (model[schemaProperties[i]] === undefined || model[schemaProperties[i]] === '')) {
                    requiredValidMsg = false;
                    requiredValidMsg = schema[schemaProperties[i]]['required']['msg'];
                }

                if (!requiredValid)
                    return MaskUtil.$_returnValidationResult(false, requiredValidMsg);
            }

            if (schema[schemaProperties[i]].hasOwnProperty('type')) {
                let typeValid = true;
                let typeValidMsg = '';
                let typeDataType = '';
                if (typeof schema[schemaProperties[i]]['type'] === 'string') {
                    typeDataType = schema[schemaProperties[i]]['type'];
                } else if (typeof schema[schemaProperties[i]]['type'] === 'object') {
                    typeDataType = schema[schemaProperties[i]]['type']['value'];
                }

                if (typeDataType === 'int' && typeof model[schemaProperties[i]] !== 'number') {
                    typeValid = false;
                    typeValidMsg = schemaProperties[i] + ' must be an integer';
                } else if (typeDataType === 'string' && typeof model[schemaProperties[i]] !== 'string') {
                    typeValid = false;
                    typeValidMsg = schema[schemaProperties[i]]['type']['msg'];
                }

                if (!typeValid) {
                    return MaskUtil.$_returnValidationResult(false, typeValidMsg);
                }
            }

            if (schema[schemaProperties[i]].hasOwnProperty('min')) {
                let minValue;
                let minValid = true;
                let minValidMsg = '';
                if (typeof schema[schemaProperties[i]]['min'] === 'number') {
                    minValue = schema[schemaProperties[i]]['min'];
                    minValidMsg = schemaProperties[i] + ' must be minimum of ' + schema[schemaProperties[i]]['min'];
                } else if (typeof schema[schemaProperties[i]]['min'] === 'object') {
                    minValue = schema[schemaProperties[i]]['min']['value'];
                    minValidMsg = schema[schemaProperties[i]]['min']['msg'];
                }

                if (typeof minValue === 'number') {
                    if ((typeof model[schemaProperties[i]] === 'number' && model[schemaProperties[i]] < minValue) || (typeof model[schemaProperties[i]] === 'string' && model[schemaProperties[i]]['length'] < minValue))
                        minValid = false;
                }

                if (!minValid)
                    return MaskUtil.$_returnValidationResult(false, minValidMsg);
            }

            if (schema[schemaProperties[i]].hasOwnProperty('max')) {
                let maxValue;
                let maxValid = true;
                let maxValidMsg = '';
                if (typeof schema[schemaProperties[i]]['max'] === 'number') {
                    maxValue = schema[schemaProperties[i]]['max'];
                    maxValidMsg = schemaProperties[i] + ' can be maximum of ' + schema[schemaProperties[i]]['max'];
                } else if (typeof schema[schemaProperties[i]]['max'] === 'object') {
                    maxValue = schema[schemaProperties[i]]['max']['value'];
                    maxValidMsg = schema[schemaProperties[i]]['max']['msg'];
                }

                if (typeof maxValue === 'number') {
                    if ((typeof model[schemaProperties[i]] === 'number' && model[schemaProperties[i]] > maxValue) || (typeof model[schemaProperties[i]] === 'string' && model[schemaProperties[i]]['length'] > maxValue))
                        maxValid = false;
                }

                if (!maxValid)
                    return MaskUtil.$_returnValidationResult(false, maxValidMsg);
            }

            if (schema[schemaProperties[i]].hasOwnProperty('in')) {
                if (!schema[schemaProperties[i]]['in'].includes(model[schemaProperties[i]]))
                    return MaskUtil.$_returnValidationResult(false, schemaProperties[i] + ' can contain any of the following values (' + schema[schemaProperties[i]]['in'].join(',') + ')');
            }

            if (schema[schemaProperties[i]].hasOwnProperty('custom') && !schema[schemaProperties[i]].custom.f(model[schemaProperties[i]])) {
                let customValidMsg = (schema[schemaProperties[i]]['custom'].hasOwnProperty('msg')) ? schema[schemaProperties[i]]['custom']['msg'] : 'custom validation error on ' + schemaProperties[i];
                return MaskUtil.$_returnValidationResult(false, customValidMsg);
            }

        }

        return MaskUtil.$_returnValidationResult(true, '');
    }

    static $_returnValidationResult(valid, msg) {
        return {
            valid: valid,
            msg: msg
        };
    }

    static $containsNumber(v) {
        return /\d/.test(v.toString());
    }

    static $containsNonNumberCharacter(v) {
        return /\D/.test(v.toString());
    }
}

module.exports.Util = MaskUtil;