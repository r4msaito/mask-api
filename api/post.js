const express = require('express');
const router = express.Router();
const { check, validationResult, checkSchema } = require('express-validator');
const { transaction } = require('objection');
const { Util } = absRequire('includes/util');
const { Post } = absRequire('models/post');
const { PostCat } = absRequire('models/post-cat');
const { PostReact } = absRequire('models/post-react');
const { PostCatRel } = absRequire('models/post-cat-rel');
const { ErrorLogger } = absRequire('models/error-log');
const { DBErrorHandler } = absRequire('includes/db-error-handler');
const { JWTAuthenticator } = absRequire('includes/jwt-authenticator');
const { constants } = absRequire('includes/constants');

/*
 * Add post
 */

router.post('/', [
    JWTAuthenticator.authenticate,
    check('content').not().isEmpty().withMessage('content must not be empty')
    .isLength({ min: 8, max: 10000 }).withMessage('content must be atleast 8 characters in length and 10000 at max'),
    check('post_cats').custom(postCatVal => {
        if (postCatVal === undefined)
            return true;

        if (!PostCat.validatePostCatInput(postCatVal))
            throw new Error('post_cats should be comma separated values and it can contain only numbers');

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
        author: req.jwtData.currentUserID,
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

router.patch('/:id', [
    JWTAuthenticator.authenticate,
    checkSchema({
        id: { in: ['params'],
            errorMessage: 'id must contain post id',
            isInt: true,
            toInt: true
        }
    }),
    check('content').not().isEmpty().withMessage('content must not be empty')
    .isLength({ min: 8, max: 10000 }).withMessage('content must be atleast 8 characters in length and 10000 at max'),
    check('post_cats').custom(postCatVal => {
        if (postCatVal === undefined)
            return true;

        if (!PostCat.validatePostCatInput(postCatVal))
            throw new Error('post_cats should be comma separated values and it can contain only numbers');

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

    try {
        transaction(Post.knex(), (trx) => {
            Post.query(trx).findById(req.params.id).patch({
                content: req.body.content
            });

            if (req.body.post_cats.length)
                PostCatRel.refreshPostCatRelations(req.params.id, req.body.post_cats);
        });
    } catch (trxErr) {
        console.log(trxErr);
    }
});


/*
 * Get post cats
 */

router.get('/cats', [], (req, res, next) => {
    let resp = {};
    PostCat.query().then((result) => {
        resp.status = constants.API_STATUS_SUCCESS;
        resp.msg = 'Cats retrieved successfully';
        resp.cats = result;
        Util.die(res, resp, 200);
    }).catch((err) => {
        let errStr = JSON.stringify(err);
        if (errStr)
            ErrorLogger.logError({
                error: errStr,
                file_info: 'get cats api'
            });

        let safeMsg = DBErrorHandler.getSafeErrorMessage(err);
        resp.status = constants.API_STATUS_ERROR;
        resp.msg = safeMsg;
        Util.die(res, resp, 500);
    });
});


/*
 * React to post
 */

router.post('/react', [
    JWTAuthenticator.authenticate,
    PostReact.validateReactType,
    check('id').not().isEmpty().withMessage('id must not be empty').isInt().withMessage('id must be an integer').toInt()
], (req, res, next) => {
    let valdErrs = validationResult(req);
    if (!valdErrs.isEmpty()) {
        return Util.die(res, {
            status: 'error',
            msg: valdErrs.array()[0].msg
        }, 400);
    }

    let resp = {};
    PostReact.react(req.body.id, req.jwtData.currentUserID, req.body.type).then((reacted) => {
        resp.status = constants.API_STATUS_SUCCESS;
        resp.msg = 'Reacted successfully';
        Util.die(res, resp, 200);
    }).catch((err) => {
        let errStr = JSON.stringify(err);
        if (errStr)
            ErrorLogger.logError({
                error: errStr,
                file_info: 'react api'
            });

        let safeMsg = DBErrorHandler.getSafeErrorMessage(err);
        resp.status = constants.API_STATUS_ERROR;
        resp.msg = safeMsg;
        Util.die(res, resp, 500);
    });
});


module.exports = router;