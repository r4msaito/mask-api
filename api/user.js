const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { User } = include('models/user');
const { ErrorLogger } = include('models/error-log');
const { Util } = include('includes/util');
const { JWTAuthenticator } = include('includes/jwt-authenticator');
const { BcryptHelper } = include('includes/bcrypt-helper');
const { DBErrorHandler } = include('includes/db-error-handler');
const { constants } = include('includes/constants');
const { config } = include('config/master');

/*
 * Registration API
 */

router.post('/', [
    check('user_name').not().isEmpty().withMessage('user_name must not be empty')
    .isLength({ min: 3, max: 50 }).withMessage('user_name must be atleast 3 characters in length and 50 at max')
    .custom(val => {
        var rgx = /[^A-Za-z0-9_]/g;

        if (rgx.test(val))
            throw new Error('user_name can contain only alphabet, numbers or underscore');

        return true;
    }),
    check('pass').not().isEmpty().withMessage('pass must not be empty')
    .isLength({ min: 6, max: 50 }).withMessage('pass must be atleast 6 characters in length and 50 at max')
], async(req, res, next) => {
    let resp = {};
    let statusCode = 200;
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    let passHash = await BcryptHelper.hashPassword(req.body.pass);
    if (passHash.length === 60) {
        await User.query().insert({
            user_name: req.body.user_name,
            pass: passHash
        }).then((result) => {
            resp.status = constants.API_STATUS_SUCCESS;
            resp.msg = 'Successfully registered';
            statusCode = 200;
        }).catch((err) => {
            let errStr = JSON.stringify(err);
            if (errStr)
                ErrorLogger.logError({
                    error: errStr,
                    file_info: 'registration api'
                });

            let safeMsg = DBErrorHandler.getSafeErrorMessage(err);
            resp.status = constants.API_STATUS_ERROR;
            resp.msg = safeMsg;
            statusCode = 500;
        });
    } else {
        resp.status = constants.API_STATUS_ERROR;
        resp.msg = 'Problem in registering. Please try again later';
        statusCode = 200;
    }

    Util.die(res, resp, statusCode);
});



/*
 * Authenticate API
 */

router.post('/authenticate', [
    check('user_name').not().isEmpty().withMessage('user_name must not be empty')
    .custom(val => {
        var rgx = /[^A-Za-z0-9_]/g;

        if (rgx.test(val))
            throw new Error('user_name must contain propert characters');

        return true;
    }),
    check('pass').not().isEmpty().withMessage('pass must not be empty')
], async(req, res, next) => {
    let resp = {
        token: ''
    };
    let statusCode = 200;
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    let loggedIn = await User.checkLogin(req.body.user_name, req.body.pass);
    if (loggedIn !== false && typeof loggedIn === 'object') {
        try {
            let token = JWTAuthenticator.genJWT({
                currentUserID: loggedIn.id,
                user_name: loggedIn.user_name
            });
            resp.status = constants.API_STATUS_SUCCESS;
            resp.msg = 'Successfully logged in!';
            resp.token = token;
        } catch (err) {
            ErrorLogger.logError({
                error: err.message,
                file_info: 'user authenticate api'
            });

            resp.status = constants.API_STATUS_ERROR;
            resp.msg = 'Unexpected problem in authentication. Please try again later.';
            statusCode = 500;
        }
    } else {
        resp.status = constants.API_STATUS_ERROR;
        resp.msg = 'User name or password might be incorrect!'
    }

    Util.die(res, resp, statusCode);
});


/*
 * Checks whether user name exists
 */

router.get('/exists', [
    check('user_name').not().isEmpty().withMessage('user_name must not be empty')
    .custom(val => {
        var rgx = /[^A-Za-z0-9_]/g;

        if (rgx.test(val))
            throw new Error('user_name must contain proper characters');

        return true;
    }),
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
        resp.msg = DBErrorHandler.getSafeErrorMessage(err);
        Util.die(res, resp, 500);
    });
});


module.exports = router;