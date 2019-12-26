const express = require('express');
const router = express.Router();
const { User } = absRequire('models/user');
const { ErrorLogger } = absRequire('models/error-logger');
const { Util } = absRequire('core/util');
const { JWTAuthenticator } = absRequire('core/jwt-authenticator');
const { BcryptHelper } = absRequire('core/bcrypt-helper');
const { constants } = absRequire('core/constants');

/*
 * Registration API
 */

router.post('/', [
    (req, res, next) => {
        let schema = {
            user_name: {
                required: true,
                type: 'string',
                min: 3,
                max: 50,
                custom: {
                    f: (userName) => {
                        var rgx = /[^A-Za-z0-9_]/g;
                        if (rgx.test(userName))
                            return false

                        return true;
                    },
                    msg: 'user_name can contain only alphabet, numbers or underscore'
                }
            },
            pass: {
                required: true,
                type: 'string',
                min: 6,
                max: 50
            }
        };
        let model = {
            user_name: req.body.user_name,
            pass: req.body.pass
        };
        let validation = Util.validateSchema(schema, model);
        if (!validation.valid) {
            Util.die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {
    let resp = {};
    BcryptHelper.hashPassword(req.body.pass).then((passHash) => {
        if (passHash.length === 60) {
            let user = new User();
            user.user_name = req.body.user_name;
            user.pass = passHash;

            //validate
            if (user.validate()) {
                user.save().then((result) => {
                    resp.status = constants.API_STATUS_SUCCESS;
                    resp.msg = 'Successfully registered';
                    Util.die(res, resp, 200);
                }).catch((err) => {
                    console.log(err);
                    resp.status = constants.API_STATUS_ERROR;
                    resp.msg = 'Problem in registration. Please try again later.';
                    Util.die(res, resp, 500);
                });
            } else {
                resp.status = constants.API_STATUS_ERROR;
                resp.msg = 'Data validation error.';
                Util.die(res, resp, 200);
            }
        } else {
            resp.status = constants.API_STATUS_ERROR;
            resp.msg = 'Problem in registering. Please try again later';
            Util.die(res, resp, 200);
        }
    }).catch((passHashErr) => {
        console.log(passHashErr);
    });
});



/*
 * Authenticate API
 */

router.post('/authenticate', [
    (req, res, next) => {
        let schema = {
            user_name: {
                required: true,
                type: 'string',
                min: 3,
                max: 50,
                custom: {
                    f: (userName) => {
                        var rgx = /[^A-Za-z0-9_]/g;
                        if (rgx.test(userName))
                            return false

                        return true;
                    },
                    msg: 'user_name can contain only alphabet, numbers or underscore'
                }
            },
            pass: {
                required: true,
                type: 'string',
                min: 6,
                max: 50
            }
        };
        let model = {
            user_name: req.body.user_name,
            pass: req.body.pass
        };
        let validation = Util.validateSchema(schema, model);
        if (!validation.valid) {
            Util.die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {
    let resp = {
        token: ''
    };
    let statusCode = 200;
    User.tryLoggingIn(req.body.user_name, req.body.pass).then((canLogin) => {
        if (canLogin) {
            let token = JWTAuthenticator.genJWT({
                currentUserID: canLogin.id,
                user_name: canLogin['user_name']
            });
            resp.status = constants.API_STATUS_SUCCESS;
            resp.msg = 'Successfully logged in!';
            resp.token = token;

            Util.die(res, resp, statusCode);
        }
    }).catch((tryLoggingInErr) => {
        console.log(tryLoggingInErr);
    });
});


/*
 * Checks whether user name exists
 */

router.get('/exists', [
    (req, res, next) => {
        let schema = {
            user_name: {
                required: true,
                type: 'string',
                custom: {
                    f: (val) => {
                        var rgx = /[^A-Za-z0-9_]/g;
                        if (rgx.test(val))
                            return false

                        return true;
                    },
                    msg: 'user_name must contain proper characters'
                }
            },
        };
        let model = {};
        let validation = Util.validateSchema(schema, model);
        if (!validation.valid) {
            Util.die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {
    let resp = {
        found: false,
        msg: 'User does not exist'
    };

    User.findUserByUserName(req.body.user_name).then((result) => {
        resp.status = constants.API_STATUS_SUCCESS;
        if (result.length > 0) {
            resp.found = true;
            resp.msg = 'User is present';
            return Util.die(res, resp, 200);
        }

        return Util.die(res, resp, 200);
    }).catch((err) => {
        console.log(err);
        Util.die(res, resp, 500);
    });
});


module.exports = router;