const { maskDBConnection } = absRequire('core/db/connection');

class MaskDBQuery {
    constructor() {
        this.query = '';
        this.params = [];
    }

    getRawQuery() {
        
    }

    select(columns) {
        this.query += 'SELECT ';

        if (columns === '*') {
            this.query += '* ';
        } else {
            if (columns.length > 0) {
                this.params = columns;
                this.query += columns.fill('?', 0).split(', ');
            }
        }

        return this;
    }

    insert(table, columns, values) {
        
    }

    update(table) {
    }

    delete() {

    }

    from(table) {
        this.query = 'FROM ?';
        this.params.push(table);
        return this;
    }

    where(logicalOp, conditions) {
        let allowedLogicalOp = {
            AND: 'AND',
            OR: 'OR'
        };

        logicalOp = logicalOp.toUppserCase();

        if (conditions.length === 0)
            return this;

        if (this.query.length === 0)
            this.query += 'WHERE ';

        conditions.forEach((condition, idx) => {
            if (idx > 0)
                this.query += allowedLogicalOp[logicalOp];

            this.query += condition[0] + ' ' + condition[1] + ' ' +  + '? ';
            this.params.push(condition[2]);
        });

        return this;
    }

    groupBy(column) {
        this.query += 'GROUP BY ' + column;
        return this;
    }

    orderBy(column, order) {
        order = order.toUppserCase();
        let allowedOrders = {
            ASC: 'ASC',
            DESC: 'DESC'
        };

        this.query += 'ORDER BY ' + column;
        if (order)
            this.query += ' ' + allowedOrders[order];
    }

    limit() {
        this.query += 'LIMIT ' + parseInt(limit);
        return this;
    }

    raw(query, args) {

    }

    execute() {
        this._resetQuery();
    }

    _bindParams() {

    }

    _resetQuery() {
        this.query = '';
    }
}

module.exports.MaskDBQuery = MaskDBQuery;