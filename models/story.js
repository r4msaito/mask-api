const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');

class Story extends Model {

    static getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['story'];
    }

    static schema() {
        return {
            content: {
                type: 'string',
                min: 10,
                max: 10000
            },
            author: {
                type: 'int'
            },
            status: {
                type: 'string',
                max: 15
            }
        };
    }

    static columns() {
        return [
            'content',
            'author',
            'status',
            'created_at',
            'updated_at'
        ];
    }

    static hasCreatedAtTimeStamp() {
        return true;
    }

    static hasUpdatedAtTimeStamp() {
        return true;
    }

    updateStory() {

    }
}

Story.STATUS_PUBLISH = 'publish';
Story.STATUS_HIDDEN = 'hidden';

module.exports.Story = Story;