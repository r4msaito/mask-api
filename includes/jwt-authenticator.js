const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

class JWTAuthenticator {
    static authenticate(req, res, next) {
        
    }

    static login(user) {
        return jwt.sign(user, this.getSecret(), { expiresIn: 86400 });
    }

    static getSecret() {
        return 'HPRG3Z1SPKFuX1m0uYhk9aySvkec66NBfvV2xEgo8lRZyNxntXkMdeJCEiLF1UhQvvSvmWaWC';
    }
}

module.exports.JWTAuthenticator = JWTAuthenticator;