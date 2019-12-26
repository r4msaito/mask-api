const express = require('express');
const router = express.Router();
const { Util } = absRequire('core/util');
const { Story } = absRequire('models/story');
const { Tax } = absRequire('models/tax');
const { JWTAuthenticator } = absRequire('core/jwt-authenticator');
const { constants } = absRequire('core/constants');

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
                    f: (catsValue) => {
                        if (!Tax.isCatIDInputValid(catsValue))
                            return false;

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
], (req, res) => {
    let story = new Story();
    story.content = req.body.content;
    story.author = req.jwtData.currentUserID;
    story.status = Story.STATUS_PUBLISH;
    story.save().then((result) => {
        if (result.insertID) {
            Util.die(res, { status: constants.API_STATUS_SUCCESS, msg: 'Your story is published.' }, 200);
        } else {
            console.log(result);
            Util.die(res, { status: constants.API_STATUS_ERROR, msg: 'Problem in posting your story. Please try again later.' }, 500);
        }
    }).catch((err) => {
        console.log(err);
        Util.die(res, { status: constants.API_STATUS_ERROR, msg: 'Problem in posting your story. Please try again later.' }, 500);
    });
});


/*
 * Update post
 */

// router.patch('/:id', [
//     JWTAuthenticator.authenticate,
//     (req, res, next) => {
//         let schema = {
//             id: {
//                 required: true,
//                 type: 'int'
//             },
//             content: {
//                 required: true,
//                 type: 'string',
//                 min: 8,
//                 max: 10000
//             },
//             custom: {
//                 f: (postCatsValue) => {
//                     if (postCatsValue === undefined)
//                         return true;

//                     if (!PostCat.validatePostCatInput(postCatVal))
//                         return false

//                     return true;
//                 },
//                 msg: 'post_cats should be comma separated values and it can contain only numbers'
//             }
//         };
//         let model = {
//             id: req.params.id,
//             content: req.body.content,
//             post_cats: req.body.post_cats
//         };

//         let validation = Util.validateSchema(schema, model);
//         if (!validation.valid) {
//             Util.die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
//         } else {
//             next();
//         }
//     }
// ], (req, res) => {
//     let resp = {};
//     try {
//         transaction(Post.knex(), (trx) => {
//             Post.query(trx).findById(req.params.id).patch({
//                 content: req.body.content
//             });

//             if (req.body.post_cats.length)
//                 PostCatRel.refreshPostCatRelations(req.params.id, req.body.post_cats);
//         });
//     } catch (trxErr) {
//         console.log(trxErr);
//     }
// });


/*
 * Get post cats
 */

router.get('/cats', [], (req, res) => {
    
});


/*
 * React to post
 */

// router.post('/react', [
//     JWTAuthenticator.authenticate,
//     PostReact.validateReactType,
// ], (req, res) => {
//     let resp = {};
//     PostReact.react(req.body.id, req.jwtData.currentUserID, req.body.type).then((reacted) => {
//         resp.status = constants.API_STATUS_SUCCESS;
//         resp.msg = 'Reacted successfully';
//         Util.die(res, resp, 200);
//     }).catch((err) => {
//         let errStr = JSON.stringify(err);
//         if (errStr)
//             ErrorLogger.logError({
//                 error: errStr,
//                 file_info: 'react api'
//             });
//     });
// });


module.exports = router;