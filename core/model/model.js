const { MaskDBQuery } = absRequire('core/db/query');
const { Util } = absRequire('core/util');

class Model {
    constructor(isNew = true) {
        this.setValid(false);
        this.setValidMsg('');
        this.setNew(isNew);
        this._bindModelObjectProperties(this.columns());
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

    static getTableName() {
    
    }

    getTableName() {
        return this.constructor.getTableName();
    }

    getPKColumnName() {
        return 'id';
    }

    getPK() {
        return this[this.getPKColumnName()];
    }

    setPK(id) {
        this[this.getPKColumnName()] = id;
    }

    schema() {

    }

    columns() {

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
        let columns = this.columns();
        for (var i = 0; i < columns.length; i++)
            obj[columns[i]] = this[columns[i]];

        return obj;
    }

    validate() {
        let validationResult = Util.validateSchema(this.schema(), this);
        this._valid = validationResult.valid;
        this._validMsg = validationResult.msg;
        return this._valid;
    }

    save() {
        //validate model
        return new Promise((resolve, reject) => {
            if (this._new) {
                let _this = this;
                let query = new MaskDBQuery();
                this.beforeInsert();
                return query.insert(this.getTableName(), this.getModelObject()).execute().then((result) => {
                    _this.setPK(result.insertId);
                    _this.setNew(false);
                    _this.afterInsert();
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.beforeUpdate();
                return query.update(this.getTableName(), this.getModelObject()).execute().then((updateResult) => {
                    resolve(updateResult);
                    _this.afterUpdate();
                }).catch((updateErr) => {
                    reject(updateErr);
                });
            }
        });
    }

    patch() {

    }

    delete() {
        return (new MaskDBQuery()).delete().from(this.getTableName()).where([this.getPKColumnName(), '=', this[this.getPKColumnName()]]);
    }

    static find(condition) {
        let whr = '';
        let bind = false;
        if (typeof conditions === 'number') {
            bind = true;
            whr = [this.getPKColumnName(), '=', condition];
        } else if (typeof conditions === 'object') {
            whr = condition;
        }

        return (new MaskDBQuery()).select().from(this.getTableName()).where(whr).execute().then((result) => {
            if (bind) {
                let model = new this.constructor();
                console.log(model);
                model._bindModelObjectProperties(result);
                return model;
            } else {
                return result;
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    _bindModelObjectProperties(properties) {
        let propertyKeys = Object.keys(properties);

        for (var i = 0; i < propertyKeys; i++)
            this[propertyKeys] = (properties[propertyKeys[i]]) ? properties[propertyKeys[i]] : '';
    }
}

module.exports.Model = Model;