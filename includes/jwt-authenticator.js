const jwt = require('jsonwebtoken');
const { Util } = include('includes/util');
const { constants } = include('includes/constants');

class JWTAuthenticator {
    static authenticate(req, res, next) {
        let resp = {};
        if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
            let token = req.headers['authorization'].slice(7, req.headers['authorization'].length);

            if (token) {
                jwt.verify(token, JWTAuthenticator.getSecret(), (err, decoded) => {
                    if (err) {
                        resp.status = constants.API_STATUS_ERROR;
                        resp.msg = 'Unauthroized. Invalid token';
                        return Util.die(res, resp, 401);
                    }

                    req.jwtData = decoded;
                    next();
                });
            } else {
                resp.status = constants.API_STATUS_ERROR;
                resp.msg = 'Unauthroized. Invalid auth string';
                Util.die(res, resp, 401);
            }
        } else {
            resp.status = constants.API_STATUS_ERROR;
            resp.msg = 'Unauthroized. Check your credentials';
            Util.die(res, resp, 401);
        }
    }

    static genJWT(user) {
        return jwt.sign(user, this.getSecret(), { expiresIn: 86400 });
    }

    static getSecret() {
        return 'HPRG3Z1SPKFuX1m0uYhk9aySvkec66NBfvV2xEgo8lRZyNxntXkMdeJCEiLF1UhQvvSvmWaWC';
    }
}

module.exports.JWTAuthenticator = JWTAuthenticator;