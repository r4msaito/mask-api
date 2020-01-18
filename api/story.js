const express = require('express');
const router = express.Router();
const { Util } = absRequire('core/util');
const { Story } = absRequire('models/story');
const { EntityReaction } = absRequire('models/entity-reaction');
const { Tax } = absRequire('models/tax');
const { JWTAuthenticator } = absRequire('core/jwt-authenticator');
const { constants } = absRequire('core/constants');

/*
 * Add post
 */

router.post('/', [
    JWTAuthenticator.$authenticate,
    (req, res, next) => {
        let schema = {
            content: {
                required: true,
                type: 'string',
                min: 8,
                max: 10000
            },
            story_cats: {
                type: 'string',
                custom: {
                    f: (catsValue) => {
                        if (!Tax.isCatIDInputValid(catsValue))
                            return false;

                        return true;
                    },
                    msg: 'story_cats should be comma separated values and it can contain only numbers'
                }
            }
        };
        let model = {
            content: req.body.content,
            story_cats: req.body.story_cats
        };

        let validation = Util.$validateSchema(schema, model);
        if (!validation.valid) {
            Util.$die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
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
        if (result.insertId) {
            Util.$die(res, { status: constants.API_STATUS_SUCCESS, msg: 'Your story is published.' }, 200);
        } else {
            console.log(result);
            Util.$die(res, { status: constants.API_STATUS_ERROR, msg: 'Problem in posting your story. Please try again later.' }, 500);
        }
    }).catch((err) => {
        console.log(err);
        Util.$die(res, { status: constants.API_STATUS_ERROR, msg: 'Problem in posting your story. Please try again later.' }, 500);
    });
});


/*
 * Update post
 */

router.patch('/:id', [
    JWTAuthenticator.$authenticate,
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
                    msg: 'story_cats should be comma separated values and it can contain only numbers'
                }
            }
        };
        let model = {
            content: req.body.content,
            post_cats: req.body.post_cats
        };

        let validation = Util.$validateSchema(schema, model);
        if (!validation.valid) {
            Util.$die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {});


/*
 * Get story cats
 */

router.get('/cats', [], (req, res) => {
    Tax.getCats()
        .then((cats) => {
            Util.$die(res, { status: constants.API_STATUS_SUCCESS, msg: 'Categories retrieved', cats: cats }, 200);
        })
        .catch((err) => {
            console.log(err);
            Util.$die(res, {
                status: constants.API_STATUS_ERROR,
                msg: 'Problem in retrieving categories. Please try again later'
            }, 500);
        });
});


/*
 * React to story
 */

router.post('/react', [
    JWTAuthenticator.$authenticate,
    (req, res, next) => {
        req.body.story_id = parseInt(req.body.story_id);
        let schema = {
            story_id: {
                required: true,
                type: 'int',
                max: constants.MYSQL_UNSIGNED_INT_LIMIT
            },
            reaction_type: {
                required: true,
                in: EntityReaction.$getAllowedReactionTypes()
            }
        };

        let model = {
            story_id: req.body.story_id,
            reaction_type: req.body.reaction_type
        };

        let validation = Util.$validateSchema(schema, model);
        if (!validation.valid) {
            Util.$die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {
    EntityReaction.$react(req.body.story_id, req.jwtData.currentUserID, EntityReaction.REACT_ENTITY_STORY, req.body.reaction_type)
        .then((result) => {
            Util.$die(res, { status: constants.API_STATUS_SUCCESS, msg: 'Successfully reacted' }, 200);
        }).catch((err) => {
            console.log(err);
            Util.$die(res, {
                status: constants.API_STATUS_ERROR,
                msg: 'There was a problem in reacting to the story. Please try again later'
            }, 500);
        });
});


/*
 * Remove reaction
 */

router.delete('/react', [
    JWTAuthenticator.$authenticate,
    (req, res, next) => {
        req.body.reaction_id = parseInt(req.body.reaction_id);
        let schema = {
            reaction_id: {
                required: true,
                type: 'int',
                max: constants.MYSQL_UNSIGNED_INT_LIMIT
            }
        };

        let model = {
            reaction_id: req.body.reaction_id
        };

        let validation = Util.$validateSchema(schema, model);
        if (!validation.valid) {
            Util.$die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {
    EntityReaction.$removeReaction(req.body.reaction_id, EntityReaction.REACT_ENTITY_STORY).then((result) => {
        Util.$die(res, { status: constants.API_STATUS_SUCCESS, msg: 'Reaction successfully deleted.' }, 200);
    }).catch((err) => {
        console.log(err);
        Util.$die(res, {
            status: constants.API_STATUS_ERROR,
            msg: 'There was a problem in deleting the reaction. Please try again later'
        }, 500);
    });
});


/*
 * Get Reaction Count
 */

router.get('/react/count', [
    JWTAuthenticator.$authenticate,
    (req, res, next) => {
        req.body.story_id = parseInt(req.body.story_id);
        let schema = {
            story_id: {
                required: true,
                type: 'int',
                max: constants.MYSQL_UNSIGNED_INT_LIMIT
            }
        };

        let model = {
            story_id: req.body.story_id
        };

        let validation = Util.$validateSchema(schema, model);
        if (!validation.valid) {
            Util.$die(res, { status: constants.API_STATUS_ERROR, msg: validation.msg }, 400);
        } else {
            next();
        }
    }
], (req, res) => {
    EntityReaction.$getRectionCount(req.body.story_id, EntityReaction.REACT_ENTITY_STORY)
        .then((count) => {
            console.log(count);
            Util.$die(res, {
                status: constants.API_STATUS_SUCCESS,
                msg: 'Reaction count fetched successfully.',
                count: count
            }, 200);
        })
        .catch((err) => {
            console.log(err);
            Util.$die(res, {
                status: constants.API_STATUS_ERROR,
                msg: 'There was a problem in fetching the count. Please try again later'
            }, 500);
        });
});

module.exports = router;