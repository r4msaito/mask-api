const { MaskDBQuery } = absRequire('core/db/query');
const { Util } = absRequire('core/util');

class Model {
    constructor(isNew = true) {
        this.setValid(false);
        this.setValidMsg('');
        this.setNew(isNew);
        this._bindModelObjectProperties(this.getModelObject());
    }

    getValid() {
        return this._valid;
    }

    setValid(valid) {
        return this._valid = valid;
    }

    getValidMsg() {
        return this._validMsg;
    }

    setValidMsg(msg) {
        this._validMsg = msg;
    }

    setNew(isNew) {
        this._new = isNew;
    }

    isNew() {
        return this._new;
    }

    static $getColumnPrefix() {
        return 'msk_';
    }

    static $enableCreatedAtTimeStamp() {
        return false;
    }

    static $enableUpdatedAtTimeStamp() {
        return false;
    }

    static enableSoftDelete() {
        return false;
    }

    static $getTableName() {

    }

    static $getPKColumnName() {
        return 'id';
    }

    getPK() {
        return this[this.constructor.$getPKColumnName()];
    }

    setPK(id) {
        this[this.constructor.$getPKColumnName()] = id;
    }

    static $schema() {

    }

    static $columns() {

    }

    static $_getColumns() {
        let columns = this.$columns();

        if (this.$enableCreatedAtTimeStamp())
            columns.push('created_at');

        if (this.$enableUpdatedAtTimeStamp())
            columns.push('updated_at');

        return columns;
    }

    beforeInsert() {

    }

    afterInsert() {

    }

    beforeUpdate() {

    }

    afterUpdate() {

    }

    getModelObject() {
        let obj = {};
        let columns = this.constructor.$_getColumns();
        let pk = this.constructor.$getPKColumnName();
        obj[pk] = (this.hasOwnProperty(pk)) ? this[pk] : undefined;

        for (var i = 0; i < columns.length; i++)
            obj[columns[i]] = this[columns[i]];

        return obj;
    }

    validate() {
        let validationResult = Util.$validateSchema(this.constructor.$schema(), this);
        this._valid = validationResult.valid;
        this._validMsg = validationResult.msg;
        return this._valid;
    }

    save() {
        return new Promise((resolve, reject) => {
            if (this._new) {
                let _this = this;
                let query = new MaskDBQuery();
                this.beforeInsert();
                let currTime = Util.$getCurrMysqlDateTime();
                if (this.hasOwnProperty('created_at'))
                    this.created_at = currTime;

                if (this.hasOwnProperty('updated_at'))
                    this.updated_at = currTime;

                let columns = Object.keys(this.getModelObject());
                let values = Object.values(this.getModelObject());
                return query.insert(this.constructor.$getTableName(), columns, [
                        [values]
                    ])
                    .execute()
                    .then((result) => {
                        _this.setPK(result.insertId);
                        _this.setNew(false);
                        _this.afterInsert();
                        resolve(result);
                    }).catch((err) => {
                        if (this.hasOwnProperty('created_at'))
                            this.created_at = '';

                        if (this.hasOwnProperty('updated_at'))
                            this.updated_at = '';

                        reject(err);
                    });
            } else {
                return this.update();
            }
        });
    }

    static $save(columns, values) {
        return (new MaskDBQuery()).insert(this.$getTableName(), columns, [
                [values]
            ])
            .execute();
    }

    update() {
        let _this = this;
        this.beforeUpdate();

        if (this.constructor.$enableUpdatedAtTimeStamp())
            this['updated_at'] = Util.$getCurrMysqlDateTime();

        return query.update(this.constructor.$getTableName(), this.getModelObject())
            .execute()
            .then((updateResult) => {
                resolve(updateResult);
                _this.afterUpdate();
            }).catch((updateErr) => {
                reject(updateErr);
            });
    }

    static $update(updateFields, where) {
        let q = new MaskDBQuery();
        return q.update(this.$getTableName(), updateFields, where)
            .execute();
    }

    delete() {
        return (new MaskDBQuery())
            .delete()
            .from(this.constructor.$getTableName())
            .where([this.constructor.$getPKColumnName(), '=', this[this.constructor.$getPKColumnName()]])
            .execute();
    }

    static $delete(conditions) {
        let q = new MaskDBQuery();
        let qFrom = q.delete()
            .from(this.$getTableName());

        if (typeof conditions === 'number') {
            return qFrom.where([this.$getPKColumnName(), '=', conditions]).execute();
        } else if (typeof conditions === 'object' && conditions.length > 0) {
            let qWhere = qFrom;
            for (var i = 0; i < conditions; i++) {
                qWhere = qWhere.where([conditions[i][0], conditions[i][1], conditions[i][2]]);
            }

            return qWhere.execute();
        }

        return null;
    }

    static $find(condition) {
        if (typeof condition === 'number') {
            let whr = [this.constructor.$getPKColumnName(), '=', condition];
            return (new MaskDBQuery())
                .select()
                .from(this.$getTableName())
                .where(whr)
                .execute()
                .then((result) => {
                    if (bind) {
                        let model = new this.constructor();
                        model._bindModelObjectProperties(result);
                        return model;
                    } else {
                        return result;
                    }
                }).catch((err) => {
                    console.log(err);
                });
        } else {
            return (new MaskDBQuery());
        }
    }

    _bindModelObjectProperties(properties) {
        let propertyKeys = Object.keys(properties);
        for (var i = 0; i < propertyKeys.length; i++)
            this[propertyKeys[i]] = (properties[propertyKeys[i]]) ? properties[propertyKeys[i]] : '';

        return this;
    }
}

module.exports.Model = Model;