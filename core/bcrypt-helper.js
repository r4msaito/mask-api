const bcrypt = require('bcrypt');
const saltRounds = 10;

class BcryptHelper {
    static $hashPassword(pass) {
        return bcrypt.hash(pass, saltRounds)
    }

    static $checkHash(pass, hash) {
        return bcrypt.compare(pass, hash);
    }
}

module.exports.BcryptHelper = BcryptHelper;