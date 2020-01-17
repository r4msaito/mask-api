const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');

class Story extends Model {

    static $getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['story_terms'];
    }

    static $schema() {
        return {
            story_id: {
                type: 'int',
                min: 1,
                max: config.MYSQL_UNSIGNED_INT_LIMIT
            },
            author: {
                type: 'int',
                min: 1,
                max: config.MYSQL_UNSIGNED_INT_LIMIT
            }
        };
    }

    static $columns() {
        return [
            'story_id',
            'term_id'
        ];
    }

    addStoryTerms() {
        
    }
    
    refreshStoryTerms() {

    }
}

Story.STATUS_PUBLISH = 'publish';
Story.STATUS_HIDDEN = 'hidden';

module.exports.Story = Story;