const jwt = require('jsonwebtoken');

class JWTAuthenticator {
    static authenticate(req, res, next) {
        
    }

    static genJWT(user) {
        return jwt.sign(user, this.getSecret(), { expiresIn: 86400 });
    }

    static getSecret() {
        return 'HPRG3Z1SPKFuX1m0uYhk9aySvkec66NBfvV2xEgo8lRZyNxntXkMdeJCEiLF1UhQvvSvmWaWC';
    }
}

module.exports.JWTAuthenticator = JWTAuthenticator;