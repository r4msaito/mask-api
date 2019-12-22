const { maskDBConnection } = absRequire('core/db/connection');
const { config } = absRequire('config/master');

class MaskDBQuery {
    constructor() {
        this.setQuery('');
        this.setParams([]);
    }

    getParams() {
        return this.params;
    }

    addParams(param) {
        this.params.push(param);
    }

    setParams(p) {
        return this.params = [];
    }

    getQuery() {
        return this.query;
    }

    setQuery(q) {
        return this.query = q;
    }

    appendQuery(q) {
        this.query += q;
    }

    getRawQuery() {
        return this.query;
    }



    select(columns) {
        if (typeof columns === 'string' && columns === '*') {
            this.appendQuery('SELECT * ');
        } else if (typeof columns === 'object' && columns.length > 0) {
            this.appendQuery('SELECT ');
            this.appendQuery(columns.join(', ') + ' ');
        }

        return this;
    }

    insert(table, columns, values) {
        this.appendQuery('INSERT INTO ' + table + ' (' + columns.split(',') + ') VALUES (?) ');
        this.addParams(values);
        return this;
    }

    update(table, columns) {
        let columnsKeysArr = Object.keys(columns);
        this.query += 'UPDATE ' + table + ' ';

        for (var i = 0; i < columnsKeysArr.length; i++) {
            this.appendQuery(columnsKeysArr[i] + '=?');
            this.addParams(columns[columnsKeysArr[i]]);
        }

        return this;
    }

    delete() {
        this.appendQuery('DELETE ');
        return this;
    }

    from(table) {
        this.appendQuery('FROM ' + table + ' ');
        return this;
    }

    where(condition) {
        if (typeof condition !== 'object' || Object.keys(condition).length === 0)
            return this;

        let q = '';
        if (condition[3].length === 0)
            q += 'WHERE ';

        q += condition[0] + ' ' + condition[1] + ' ? ';
        this.addParams(condition[2]);
        this.appendQuery(q);
        return this;
    }

    groupBy(column) {
        this.appendQuery('GROUP BY ' + column);
        return this;
    }

    orderBy(column, order) {
        order = order.toUppserCase();
        let allowedOrders = {
            ASC: 'ASC',
            DESC: 'DESC'
        };

        this.appendQuery('ORDER BY ' + column);
        if (order)
            this.appendQuery(' ' + allowedOrders[order]);
    }

    limit() {
        this.query += 'LIMIT ' + parseInt(limit);
        return this;
    }

    raw(query) {
        this.appendQuery(query);
        this.setParams([])
        return this;
    }

    execute() {
        let q = this.getQuery();
        let p = this.getParams();
        this._clearQueryParams();

        return new Promise((resolve, reject) => {
            maskDBConnection.query(q, p, (err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            });

            maskDBConnection.end();
        });
    }

    _clearQueryParams() {
        this.setQuery('');
        this.setParams([]);
    }
}

module.exports.MaskDBQuery = MaskDBQuery;