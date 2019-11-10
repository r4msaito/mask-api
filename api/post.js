const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { transaction } = require('objection');
const { Util } = include('includes/util');
const { Post } = include('models/post');
const { ErrorLogger } = include('models/error-log');
const { DBErrorHandler } = include('includes/db-error-handler');
const { JWTAuthenticator } = include('includes/jwt-authenticator');
const { constants } = include('includes/constants');

/*
 * Add post
 */

router.post('/', [
    JWTAuthenticator.authenticate,
    check('content').not().isEmpty().withMessage('content must not be empty')
    .isLength({ min: 8, max: 10000 }).withMessage('content must be atleast 8 characters in length and 10000 at max'),
    check('post_cat').custom(postCatVal => {
        if (!Post.validatePostCatInput(postCatVal))
            throw new Error('post_cat should be comma separated values and it can contain only numbers');

        return true;
    })
], (req, res, next) => {
    let resp = {};
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    Post.query().insert({
        content: req.body.content,
        author: req.jwtData.id,
        status: Post.STATUS_PUBLISH
    }).then((result) => {
        resp.status = constants.API_STATUS_SUCCESS;
        resp.msg = 'Successfully posted';
        Util.die(res, resp, 200);
    }).catch((err) => {
        let errStr = JSON.stringify(err);
        if (errStr)
            ErrorLogger.logError({
                error: errStr,
                file_info: 'post api'
            });

        let safeMsg = DBErrorHandler.getSafeErrorMessage(err);
        resp.status = constants.API_STATUS_ERROR;
        resp.msg = safeMsg;
        Util.die(res, resp, 500);
    });
});


/*
 * Update post
 */

router.post('/', [
    JWTAuthenticator.authenticate,
    check('content').not().isEmpty().withMessage('content must not be empty')
    .isLength({ min: 8, max: 10000 }).withMessage('content must be atleast 8 characters in length and 10000 at max')
], (req, res, next) => {
    let resp = {};
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    try {
        transaction(Post.knex(), (trx) => {
            Post.query(trx).patch({
                content: req.body.content
            });


        });
    } catch (trxErr) {

    }
});


module.exports = router;