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
], async(req, res, next) => {
    let resp = {};
    let passHash = await BcryptHelper.hashPassword(req.body.pass);
    if (passHash.length === 60) {
        let user = new User();
        user.user_name = req.body.user_name;
        user.pass = passHash;
        //validate
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
        resp.msg = 'Problem in registering. Please try again later';
        Util.die(res, resp, 200);
    }
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
], (req, res, next) => {
    let resp = {
        token: ''
    };
    let statusCode = 200;
    let loggedIn = User.tryLoggingIn(req.body.user_name, req.body.pass);
    console.log(loggedIn);
    // if (loggedIn !== false && typeof loggedIn === 'object') {
    //     try {
    //         let token = JWTAuthenticator.genJWT({
    //             currentUserID: loggedIn.id,
    //             user_name: loggedIn.user_name
    //         });
    //         resp.status = constants.API_STATUS_SUCCESS;
    //         resp.msg = 'Successfully logged in!';
    //         resp.token = token;
    //     } catch (err) {
    //         ErrorLogger.logError({
    //             error: err.message,
    //             file_info: 'user authenticate api'
    //         });

    //         resp.status = constants.API_STATUS_ERROR;
    //         resp.msg = 'Unexpected problem in authentication. Please try again later.';
    //         statusCode = 500;
    //     }
    // } else {
    //     resp.status = constants.API_STATUS_ERROR;
    //     resp.msg = 'User name or password might be incorrect!'
    // }

    Util.die(res, resp, statusCode);
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
], async(req, res, next) => {
    let resp = { found: false };
    User.findUserByUserName(req.body.user_name).then((result) => {
        resp.status = constants.API_STATUS_SUCCESS
        if (result.length !== 0) {
            resp.found = true;
            resp.msg = 'User is present'
        } else {
            resp.msg = 'User does not exists';
        }

        Util.die(res, resp, 200);
    }).catch((err) => {
        let errStr = JSON.stringify(err);
        if (errStr)
            ErrorLog.logError({
                error: errStr,
                file_info: 'user exists api'
            });

        resp.status = constants.API_STATUS_ERROR;
        resp.msg = 'sdf';
        Util.die(res, resp, 500);
    });
});


module.exports = router;