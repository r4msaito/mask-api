const { maskDBConnection } = absRequire('core/db/connection');

class MaskDBQuery {
    constructor() {
        this.setQuery('');
        this.setParams([]);
    }

    getParams() {
        return this.params;
    }

    appendParams(param) {
        this.params.push(param);
    }

    mergeParams(p) {
        this.params = this.params.concat(p);
    }

    setParams(p) {
        this.params = p;
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
        if (columns === undefined || columns === '*') {
            this.appendQuery('SELECT * ');
        } else if (typeof columns === 'object' && columns.length > 0) {
            this.appendQuery('SELECT ');
            this.appendQuery(columns.join(', ') + ' ');
        }

        return this;
    }

    insert(table, columnValueMap) {
        let columns = Object.keys(columnValueMap);
        let values = Object.values(columnValueMap)
        let valuesPlaceHolderArr = [];
        for (var i = 0; i < values.length; i++)
            valuesPlaceHolderArr.push('?');

        this.appendQuery('INSERT INTO ' + table + ' (' + columns.join(',') + ') VALUES (' + valuesPlaceHolderArr.join(',') + ') ');
        this.mergeParams(values);
        return this;
    }

    update(table, columns) {
        let columnsKeysArr = Object.keys(columns);
        this.query += 'UPDATE ' + table + ' ';

        for (var i = 0; i < columnsKeysArr.length; i++) {
            this.appendQuery(columnsKeysArr[i] + '=?');
            this.appendParams(columns[columnsKeysArr[i]]);
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

    innerJoin(table, on) {
        this.appendQuery('INNER JOIN ' + table + ' ON ' + on + ' ');
        return this;
    }

    where(condition) {
        if (typeof condition !== 'object' || Object.keys(condition).length === 0)
            return this;

        let q = '';
        if (condition[3] === undefined || !condition[3])
            q += 'WHERE ';

        q += condition[0] + condition[1] + '? ';
        this.appendParams(condition[2]);
        this.appendQuery(q);
        return this;
    }

    groupBy(column) {
        this.appendQuery('GROUP BY ' + column);
        return this;
    }

    orderBy(column, order) {
        order = (order === undefined) ? 'ASC' : order.toUppserCase();
        let allowedOrders = {
            ASC: 'ASC',
            DESC: 'DESC'
        };

        this.appendQuery('ORDER BY ' + column);
        if (order)
            this.appendQuery(' ' + allowedOrders[order] + ' ');

        return this;
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
        });
    }

    _clearQueryParams() {
        this.setQuery('');
        this.setParams([]);
    }
}

module.exports.MaskDBQuery = MaskDBQuery;