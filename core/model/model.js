const { maskDB } = absRequire('core/db/connection');

class Model {
    constructor() {
        this._valid = false;
        this._new = false;

    }

    schema() {

    }

    validate() {

        this._valid = false;
    }

    save() {
        
    }

    update() {

    }

    delete() {
        
    }

    find() {

    }

    findOne() {

    }
}

module.exports.Model = Model;