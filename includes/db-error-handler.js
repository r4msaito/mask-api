const { config } = include('config/master');
const { ValidationError } = require('objection');
const {
    DBError,
    ConstraintViolationError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError
} = require('objection-db-errors');

class DBErrorHandler {
    static getSafeErrorMessage(err) {
        if (err instanceof UniqueViolationError) {
            let colName = this.getColumnNameFromUniqueConstraint(err.constraint);
            return colName + ' must be unique';
        } else if (err instanceof DBError) {
            return 'Unexpected problem. Try again later.';
        } else if (err instanceof ValidationError) {
            return err.message.replace(':', '');
        }
    }

    static getColumnNameFromUniqueConstraint(constraint) {
        let constraintSliced = constraint.slice(0, -7);
        for (let table in config['db']['table']) {
            let fullTableName = config['db']['table_prefix'] + config['db']['table'][table];
            if (constraintSliced.includes(fullTableName))
                return constraintSliced.replace(fullTableName + '_', '');
        }
    }
}

module.exports.DBErrorHandler = DBErrorHandler;