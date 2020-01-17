const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');
const { constants } = absRequire('core/constants');

class EntityReaction extends Model {

    static $getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['entity_reaction'];
    }

    static $schema() {
        return {
            entity_id: {
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
                in: EntityReaction.$getAllowedreactionTypes()
            }
        }
    }

    static $columns() {
        return [
            'entity_id',
            'user_id',
            'reaction_type',
            'entity_type'
        ];
    }

    static $enableCreatedAtTimeStamp() {
        return true;
    }

    static $enableUpdatedAtTimeStamp() {
        return true;
    }

    static $getAllowedreactionTypes() {
        return [
            EntityReaction.REACT_TYPE_LIKE
        ];
    }

    static $react(entityID, userID, entityType, reactionType) {
        return EntityReaction.$alreadyReacted(entityID, userID, entityType, reactionType)
            .then((alreadyReacted) => {
                if (alreadyReacted) {
                    if (alreadyReacted.reaction_type !== reactionType) {
                        return EntityReaction.$alterReaction(alreadyReacted[$getPKColumnName()], reactionType);
                    } else {
                        return true;
                    }
                } else {
                    return EntityReaction.$addReact(entityID, userID, entityType, reactionType);
                };
            })
    }

    static $alreadyReacted(entityID, userID, entityType, reactionType) {
        return new Promise((resolve, reject) => {
            return EntityReaction.$find()
                .select([EntityReaction.$getPKColumnName(), 'reaction_type'])
                .from(EntityReaction.$getTableName())
                .where(['entity_id', '=', entityID])
                .where(['user_id', '=', userID, 'AND'])
                .where(['entity_type', '=', entityType, 'AND'])
                .execute()
                .then((reacted) => {
                    if (reacted.length > 0) {
                        resolve(reacted[0]);
                    } else {
                        resolve(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                })
        });
    }

    static $alterReaction(reactionID, reactionType) {
        return EntityReaction.$update(reactionID, reactionType);
    }

    static $removeReaction(reactionID) {
        return EntityReaction.$delete(reactionID);
    }

    static $addReact(entityID, userID, entityType, reactionType) {
        let react = new this.constructor();
        react.entity_id = entityID;
        react.user_id = userID;
        react.react_type = reactionType;
        react.entity_type = entityType;
        return react.save();
    }

    static $getRections(entityID, entityType) {

    }
}

EntityReaction.REACT_TYPE_LIKE = 'like';
EntityReaction.REACT_ENTITY_STORY = 'story';

module.exports.EntityReaction = EntityReaction;