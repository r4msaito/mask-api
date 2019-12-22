const { MaskDBQuery } = absRequire('core/db/query');
const { Util } = absRequire('core/util');

class Model {
    constructor(isNew = true) {
        this.setValid(false);
        this.setValidMsg('');
        this.setNew(isNew);
        this.bindModelObjectProperties(this.columns());
        console.log(Model.getTableName());
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

    schema() {

    }

    getIDColumn() {
        return 'id';
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
                return query.insert(Model.getTableName(), this.getModelObject()).execute().then((result) => {
                    _this[this.getIDColumn()] = result[_this.getIDColumn()];
                    _this._new = false;
                    _this.afterInsert();
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.beforeUpdate();
                query.update(Model.getTableName(), this.getModelObject()).execute().then((updateResult) => {
                    resolve(updateResult);
                    this.afterUpdate();
                }).catch((updateErr) => {
                    reject(updateErr);
                });
            }
        });
    }

    patch() {

    }

    delete() {
        return (new MaskDBQuery()).delete().from(Model.getTableName()).where([this.getIDColumn(), '=', this[this.getIDColumn()]]);
    }

    static find(condition) {
        let whr = '';
        let bind = false;
        if (typeof conditions === 'number') {
            bind = true;
            whr = [this.getIDColumn(), '=', condition];
        } else if (typeof conditions === 'object') {
            whr = condition;
        }
        return (new MaskDBQuery()).select().from(Model.getTableName()).where(whr).execute().then((result) => {
            if (bind === true && result.length > 0) {
                let model = new Model(false);
                model.bindModelObjectProperties(result);
                return model;
            } else {
                return result;
            }
        });
    }

    bindModelObjectProperties(properties) {
        let propertyKeys = Object.keys(properties);

        for (var i = 0; i < propertyKeys; i++)
            this[propertyKeys] = (properties[propertyKeys[i]]) ? properties[propertyKeys[i]] : '';
    }
}

module.exports.Model = Model;