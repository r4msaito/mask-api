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

    static getColumnPrefix() {
        return 'msk_';
    }

    static hasCreatedAtTimeStamp() {
        return false;
    }

    static hasUpdatedAtTimeStamp() {
        return false;
    }

    static getTableName() {

    }

    static getPKColumnName() {
        return 'id';
    }

    getPK() {
        return this[this.constructor.getPKColumnName()];
    }

    setPK(id) {
        this[this.constructor.getPKColumnName()] = id;
    }

    static schema() {

    }

    static columns() {

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
        let columns = this.constructor.columns();
        let pk = this.constructor.getPKColumnName();
        obj[pk] = (this.hasOwnProperty(pk)) ? this[pk] : undefined;
        if (this.constructor.hasCreatedAtTimeStamp())
            obj['created_at'] = (this.hasOwnProperty('created_at')) ? this['created_at'] : undefined;

        if (this.constructor.hasUpdatedAtTimeStamp())
            obj['updated_at'] = (this.hasOwnProperty('created_at')) ? this['updated_at'] : undefined;

        for (var i = 0; i < columns.length; i++)
            obj[columns[i]] = this[columns[i]];

        return obj;
    }

    validate() {
        let validationResult = Util.validateSchema(this.constructor.schema(), this);
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
                let currTime = Util.getCurrMysqlDateTime();

                if (this.constructor.hasCreatedAtTimeStamp())
                    this['created_at'] = currTime;

                if (this.constructor.hasUpdatedAtTimeStamp())
                    this['updated_at'] = currTime;

                return query.insert(this.constructor.getTableName(), this.getModelObject()).execute().then((result) => {
                    _this.setPK(result.insertId);
                    _this.setNew(false);
                    _this.afterInsert();
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                return this.update();
            }
        });
    }

    update() {
        let _this = this;
        this.beforeUpdate();

        if (this.constructor.hasUpdatedAtTimeStamp())
            this['updated_at'] = Util.getCurrMysqlDateTime();

        return query.update(this.constructor.getTableName(), this.getModelObject()).execute().then((updateResult) => {
            resolve(updateResult);
            _this.afterUpdate();
        }).catch((updateErr) => {
            reject(updateErr);
        });
    }

    delete() {
        return (new MaskDBQuery())
            .delete()
            .from(this.constructor.getTableName())
            .where([this.constructor.getPKColumnName(), '=', this[this.constructor.getPKColumnName()]]);
    }

    static find(condition) {
        if (typeof condition === 'number') {
            return (new MaskDBQuery()).select().from(this.getTableName()).where(whr).execute().then((result) => {
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
        for (var i = 0; i < propertyKeys; i++)
            this[propertyKeys] = (properties[propertyKeys[i]]) ? properties[propertyKeys[i]] : '';
    }
}

module.exports.Model = Model;