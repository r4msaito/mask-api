const bcrypt = require('bcrypt');
const saltRounds = 10;

class BcryptHelper {
    static async hashPassword(pass) {
        return await bcrypt.hash(pass, saltRounds)
        .then((hash) => {
            return hash
        }).catch((err) => {
            return err;
        });
    }

    static checkHash() {
        bcrypt.compare(myPlaintextPassword, hash)
        .then((match) => {
            return match
        }).catch((err) => {
            return err;
        });
    }
}

module.exports.BcryptHelper = BcryptHelper;