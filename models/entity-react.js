const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');
const { constants } = absRequire('core/constants');

class EntityReact extends Model {

    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['story_react'];
    }

    static schema() {
        return {
            story_id: {
                required: true,
                type: 'int',
                max: config.MYSQL_UNSIGNED_INT_LIMIT
            },
            user_id: {
                required: true,
                type: 'int',
                max: config.MYSQL_UNSIGNED_INT_LIMIT
            },
            type: {
                required: true,
                in: EntityReact.getAllowedReactTypes()
            }
        }
    }

    static columns() {
        return [
            'story_id',
            'user_id',
            'react_type',
            'entity_type'
        ];
    }

    static hasCreatedAtTimeStamp() {
        return true;
    }

    static hasUpdatedAtTimeStamp() {
        return true;
    }

    static getAllowedReactTypes() {
        return [
            EntityReact.REACT_TYPE_LIKE
        ];
    }

    static validateReactType(req, res, next) {
        if (!EntityReact.getAllowedReactTypes().includes(req.body.type)) {
            return Util.die(res, {
                status: constants.API_STATUS_ERROR,
                msg: 'react type not allowed'
            }, 400);
        }

        next();
    }

    static react(entityID, userID, reactType) {

    }

    static alreadyReacted(entityID, userID, entityType) {
        return new Promise((resolve, reject) => {
            return EntityReact.find()
                .select(EntityReact.getPKColumnName())
                .where(['entity_id', '=', entityID])
                .where(['user_id', '=', userID])
                .where(['entity_type', '=', entityType])
                .execute()
                .then((reacted) => {
                    resolve(true);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        });
    }

    static removeReaction(entityID, userID, entityType) {
        return EntityReact.
    }

    static addReact(entityID, userID, reactType, entityType) {
        let react = new this.constructor();
        react.entity_id = entityID;
        react.user_id = userID;
        react.react_type = reactType;
        react.entity_type = entityType;
        return react.save();
    }
}

EntityReact.REACT_TYPE_LIKE = 'like';
EntityReact.REACT_ENTITY_STORY = 'story';

module.exports.EntityReact = EntityReact;