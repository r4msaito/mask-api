const { BaseModel } = absRequire('models/base-model');
const { config } = absRequire('config/master');
const { Util } = absRequire('includes/util');
const { constants } = absRequire('includes/constants');

class PostReact extends BaseModel {

    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['post_react'];
    }

    static get jsonSchema() {
        return {
            required: ['post_id', 'user_id', 'type'],
            properties: {
                id: { type: 'integer' },
                post_id: { type: 'integer' },
                user_id: { type: 'integer' },
                type: { type: 'string' }
            }
        };
    }

    $beforeInsert() {
        let currMySQLDateTime = Util.getCurrMysqlDateTime();
        this.created_at = currMySQLDateTime;
    }

    static validateReactType(req, res, next) {
        if (!PostReact.getAllowedReactTypes().includes(req.body.type)) {
            return Util.die(res, {
                status: constants.API_STATUS_ERROR,
                msg: 'react type not allowed'
            }, 400);
        }

        next();
    }

    static react(postID, userID, type) {
        return PostReact.alreadyReacted(postID, userID)
            .then((reacted) => {
                if (reacted.length) {
                    if (reacted[0].type === type) {
                        return new Promise((resolve, reject) => {
                            resolve(true);
                        })
                    } else {
                        return PostReact.removeReaction(postID, userID).then((removed) => {
                            return PostReact.addReact(postID, userID, type);
                        });
                    }
                } else {
                    return PostReact.addReact(postID, userID, type);
                }
            });
    }

    static alreadyReacted(postID, userID) {
        return PostReact.query()
            .select(PostReact.tableName + '.id', PostReact.tableName + '.type')
            .where('post_id', postID)
            .where('user_id', userID);
    }

    static removeReaction(postID, userID) {
        return PostReact.query()
            .delete()
            .where('post_id', postID)
            .where('user_id', userID);
    }

    static addReact(postID, userID, type) {
        return PostReact.query()
            .insert({
                post_id: postID,
                user_id: userID,
                type: type
            });
    }

    static getAllowedReactTypes() {
        return [
            PostReact.REACT_TYPE_LIKE
        ];
    };

}

PostReact.REACT_TYPE_LIKE = 'like';

module.exports.PostReact = PostReact;