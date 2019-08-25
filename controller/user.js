const BaseController = require('./base-controller')
const UserModel = require('../models/user');

class MSKUser extends BaseController {
    static model() {
        return UserModel;
    }
}

module.exports = MSKUser;