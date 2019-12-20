const { maskDBConnection } = absRequire('core/db/connection');
const { config } = absRequire('config/master');

class MaskDBQuery {
    constructor() {
        this.query = '';
        this.params = [];
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

    addQuery(q) {
        this.query += q;
    }

    getRawQuery() {
        return this.query;
    }

    select(columns) {
        this.query += 'SELECT ';

        if (columns === '*') {
            this.addQuery('* ');
        } else {
            if (columns.length > 0) {
                this.params = columns;
                this.addQuery(columns.split(', '));
            }
        }

        return this;
    }

    insert(table, columns, values) {
        this.addQuery('INSERT INTO ' + table + ' (' + columns.split(',') + ') VALUES (?) ');
        this.addParams(values);
        return this;
    }

    update(table, columns) {
        let columnsKeysArr = Object.keys(columns);
        this.query += 'UPDATE ' + table + ' ';

        for (var i = 0; i < columnsKeysArr.length; i++) {
            this.addQuery(columnsKeysArr[i] + '=?');
            this.addParams(columns[columnsKeysArr[i]]);
        }

        return this;
    }

    delete() {
        this.addQuery('DELETE ');
        return this;
    }

    from(table) {
        this.addQuery('FROM ?');
        this.addParams(table);
        return this;
    }

    where(condition) {
        if (condition.length === 0)
            return this;

        if (this.query.length === 0)
            this.query += 'WHERE ';

        this.addQuery(condition[0] + ' ' + condition[1] + ' ' + +'? ');
        this.addParams(condition[2]);

        return this;
    }

    groupBy(column) {
        this.addQuery('GROUP BY ' + column);
        return this;
    }

    orderBy(column, order) {
        order = order.toUppserCase();
        let allowedOrders = {
            ASC: 'ASC',
            DESC: 'DESC'
        };

        this.addQuery('ORDER BY ' + column);
        if (order)
            this.addQuery(' ' + allowedOrders[order]);
    }

    limit() {
        this.query += 'LIMIT ' + parseInt(limit);
        return this;
    }

    raw(query) {
        this.addQuery(query);
        this.setParams([])
        return this;
    }

    execute() {
        let q = this.getQuery();
        let p = this.getParams();
        this._clearQueryParams();

        return maskDBConnection.then((connection) => {
            console.log(q);
            console.log(p);
            let c = connection.query(q, p);
            connection.end();
            return c;
        }).then((rows) => {
            console.log(rows.sql);
            if (rows.length > 1)
                return rows[0];

            return rows;
        }).catch((err) => {
            console.log(err);
            return err;
        });
    }

    _clearQueryParams() {
        this.setQuery('');
        this.setParams([]);
    }
}

module.exports.MaskDBQuery = MaskDBQuery;