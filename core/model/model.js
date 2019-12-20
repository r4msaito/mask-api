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
        if (!this.validate())
            return this.getValid();

        if (this.new) {
            let _this = this;
            let query = new maskDBQuery();
            return query.insert(this.getTableName(), this.getModelObject()).execute().then((result) => {
                _this[this.getIDColumn()] = result[_this.getIDColumn()];
                _this.new = false;
                return result;
            }).catch((err) => {
                console.log(err);
            });
        } else {
            return query.update(this.getTableName(), this.getModelObject()).execute();
        }
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
            whr = [this.getIDColumn(), '=', this[this.getIDColumn()]];
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
        let propertyKeys = Object.keys(properties);

        for (var i = 0; i < propertyKeys; i++)
            this[propertyKeys] = (properties[propertyKeys[i]]) ? properties[propertyKeys[i]] : '';
    }
}

module.exports.Model = Model;