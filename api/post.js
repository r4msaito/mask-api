const express = require('express');
const router = express.Router();
const { Util } = absRequire('includes/util');
const { Post } = absRequire('models/post');
const { PostCat } = absRequire('models/post-cat');
const { PostReact } = absRequire('models/post-react');
const { PostCatRel } = absRequire('models/post-cat-rel');
const { ErrorLogger } = absRequire('models/error-logger');
const { JWTAuthenticator } = absRequire('includes/jwt-authenticator');
const { constants } = absRequire('includes/constants');

/*
 * Add post
 */

router.post('/', [
    JWTAuthenticator.authenticate,
    (req, res, next) => {
        let schema = {
            content: {
                required: true,
                type: 'string',
                min: 8,
                max: 10000
            },
            post_cats: {
                type: 'string',
                custom: {
                    f: (postCatsValue) => {
                        if (postCatsValue === undefined)
                            return true;

                        if (!PostCat.validatePostCatInput(postCatVal))
                            return false

                        return true;
                    },
                    msg: 'post_cats should be comma separated values and it can contain only numbers'
                }
            }
        };
        let model = {
            content: req.body.content,
            post_cats: req.body.post_cats
        };

        let validation = Util.validateSchema(schema, model);
        if (!validation.valid) {
            Util.die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res, next) => {
    let resp = {};
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
    (req, res, next) => {
        let schema = {
            id: {
                required: true,
                type: 'int'
            },
            content: {
                required: true,
                type: 'string',
                min: 8,
                max: 10000
            },
            custom: {
                f: (postCatsValue) => {
                    if (postCatsValue === undefined)
                        return true;

                    if (!PostCat.validatePostCatInput(postCatVal))
                        return false

                    return true;
                },
                msg: 'post_cats should be comma separated values and it can contain only numbers'
            }
        };
        let model = {
            id: req.params.id,
            content: req.body.content,
            post_cats: req.body.post_cats
        };

        let validation = Util.validateSchema(schema, model);
        if (!validation.valid) {
            Util.die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res, next) => {
    let resp = {};
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
], (req, res, next) => {
    let valdErrs = validationResult(req);
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