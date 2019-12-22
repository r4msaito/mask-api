const { MaskDBQuery } = absRequire('core/db/query');
const { Util } = absRequire('core/util');

class Model {
    constructor(isNew = true) {
        this.setValid(false);
        this.setValidMsg('');
        this.setNew(isNew);
        this.bindModelObjectProperties(this.columns());
    }

    getValid() {
        return this.valid;
    }

    setValid(valid) {
        return this.valid = valid;
    }

    getValidMsg() {
        return this.validMsg;
    }

    setValidMsg(msg) {
        this.validMsg = msg;
    }

    setNew(isNew) {
        this.new = isNew;
    }

    isNew() {
        return this.new;
    }

    getTableName() {

    }

    schema() {

    }

    getIDColumn() {
        return 'id';
    }

    columns() {

    }

    beforeInsert() {
        console.log('inside beforeInsert base');
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
        this.valid = validationResult.valid;
        this.validMsg = validationResult.msg;
        return this.valid;
    }

    save() {
        //validate model
        return new Promise((resolve, reject) => {
            if (!this.validate())
                resolve(this.getValid());

            if (this.new) {
                let _this = this;
                let query = new maskDBQuery();
                this.beforeInsert();
                return query.insert(this.getTableName(), this.getModelObject()).execute().then((result) => {
                    _this[this.getIDColumn()] = result[_this.getIDColumn()];
                    _this.new = false;
                    _this.afterInsert();
                    resolve(result);
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            } else {
                this.beforeUpdate();
                query.update(this.getTableName(), this.getModelObject()).execute().then((updateResult) => {
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
        return (new maskDBQuery()).delete().from(this.getTableName()).where([this.getIDColumn(), '=', this[this.getIDColumn()]]);
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
        return (new maskDBQuery()).select().from(this.getTableName()).where(whr).execute().then((result) => {
            if (bind === true && result.length > 0) {
                let model = new Model();

                model.bindModelObjectProperties(result);
                return model;
            } else {
                return result;
            }
        });
    }

    bindModelObjectProperties(properties) {
        console.log('inside bindModelObjectProperties');
        console.log(properties);
        let propertyKeys = Object.keys(properties);

        for (var i = 0; i < propertyKeys; i++)
            this[propertyKeys] = (properties[propertyKeys[i]]) ? properties[propertyKeys[i]] : '';
    }
}

module.exports.Model = Model;