const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');

class StoryTerms extends Model {

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

    static $addStoryTerms(story_id, term_ids) {
        let values = [];

        for (var i = 0; i < term_ids.length; i++)
            values.push([story_id, term_ids[i]]);
        
        return StoryTerms.$save(StoryTerms.$columns(), values);
    }    
}

module.exports.StoryTerms = StoryTerms;