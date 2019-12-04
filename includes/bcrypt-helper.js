const bcrypt = require('bcrypt');
const saltRounds = 10;

class BcryptHelper {
    static async hashPassword(pass) {
        return await bcrypt.hash(pass, saltRounds)
    }

    static async checkHash(pass, hash) {
        return await bcrypt.compare(pass, hash);
    }
}

module.exports.BcryptHelper = BcryptHelper;