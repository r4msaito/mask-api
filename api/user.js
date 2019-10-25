const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { User } = include('models/user');
const { Util } = include('includes/util');
const { BcryptHelper } = include('includes/bcrypt-helper');
const { JWTAuthenticator } = include('includes/jwt-authenticator');


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
    check('pwd').not().isEmpty().withMessage('pwd must not be empty')
        .isLength({ min: 6, max: 50 }).withMessage('pwd must be atleast 6 characters in length and 50 at max')
], async (req, res, next) => {
    let resp = {};
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    let passHash = await BcryptHelper.hashPassword(req.body.pwd);
    if (passHash.length === 60) {
        let userInsert = await User.query().insert({
            user_name: req.body.user_name,
            pass: passHash
        });

        console.log(passHash);
        console.log(passHash);
    } else {
        resp.status = 'error';
        resp.msg = 'problem in calculating pass hash';
    }

    Util.die(res, resp, 200);
});

/*
 * Delete API
 */

router.delete('/', [
    check('id').not().isEmpty().withMessage('id must not be empty')
        .isDecimal().withMessage('id must be an integer')
], async (req, res, next) => {
    let resp = {};
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    let delUser = await User.delete(req.body.id);

    if (delUser) {
        resp.status = 'success';
        resp.msg = req.body.id;
    } else {
        resp.status = 'error';
    }

    Util.die(res, resp, 200);
});

/*
 * Login API
 */

router.post('/login', [
    check('user_name').not().isEmpty().withMessage('user_name must not be empty'),
    check('pwd').not().isEmpty().withMessage('pwd must not be empty')
], (req, res, next) => {
    let resp = {};
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    let token = BaseJWTAuthenticator.login({ foo: 'bar' });
    if (token) {
        resp.status = 'success';
        resp.token = token;
        resp.msg = 'Login successful';
    } else {
        resp.status = 'error';
        resp.msg = 'User name or password might be incorrect';
        resp.token = '';
    }

    Util.die(res, resp, 200);

});

module.exports = router;