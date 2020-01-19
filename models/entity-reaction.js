const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');

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

    static $getAllowedReactionTypes() {
        return [
            EntityReaction.REACT_TYPE_LIKE,
            EntityReaction.REACT_TYPE_DISLIKE
        ];
    }

    static $react(entityID, userID, entityType, reactionType) {
        return EntityReaction.$alreadyReacted(entityID, userID, entityType)
            .then((alreadyReacted) => {
                if (alreadyReacted) {
                    if (alreadyReacted.reaction_type !== reactionType) {
                        return EntityReaction.$alterReaction(alreadyReacted[EntityReaction.$getPKColumnName()], reactionType);
                    } else {
                        return true;
                    }
                } else {
                    return EntityReaction.$addReact(entityID, userID, entityType, reactionType);
                };
            })
    }

    static $alreadyReacted(entityID, userID, entityType) {
        return EntityReaction.$find()
            .select([EntityReaction.$getPKColumnName(), 'reaction_type'])
            .from(EntityReaction.$getTableName())
            .where(['entity_id', '=', entityID])
            .where(['user_id', '=', userID, 'AND'])
            .where(['entity_type', '=', entityType, 'AND'])
            .execute()
            .then((reacted) => {
                if (reacted.length > 0) {
                    return reacted[0];
                } else {
                    return false;
                }
            })
            .catch((err) => {
                return err;
            });
    }

    static $alterReaction(id, reactionType) {
        let updateObj = {};
        updateObj[EntityReaction.$getPKColumnName()] = id;
        return EntityReaction.$update({ reaction_type: reactionType }, updateObj);
    }

    static $removeReaction(reactionID) {
        return EntityReaction.$delete(reactionID);
    }

    static $addReact(entityID, userID, entityType, reactionType) {
        let reaction = new EntityReaction();
        reaction.entity_id = entityID;
        reaction.user_id = userID;
        reaction.reaction_type = reactionType;
        reaction.entity_type = entityType;
        return reaction.save();
    }

    static $getRectionCount(entityID, entityType) {
        return new Promise((resolve, reject) => {
            return EntityReaction.$find()
            .select(['COUNT(' + EntityReaction.$getPKColumnName() + ') as reaction_count'])
            .from(EntityReaction.$getTableName())
            .where(['entity_id', '=', entityID])
            .where(['entity_type', '=', entityType, 'AND'])
            .execute()
            .then((result) => {
                resolve(result[0]['reaction_count']);
            });
        });
    }
}

EntityReaction.REACT_TYPE_LIKE = 'like';
EntityReaction.REACT_TYPE_DISLIKE = 'dislike';
EntityReaction.REACT_ENTITY_STORY = 'story';

module.exports.EntityReaction = EntityReaction;