const { Model } = absRequire('core/model/model');
const { StoryTerms } = absRequire('models/story-terms');
const { config } = absRequire('config/master');

class Story extends Model {

    static $getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['story'];
    }

    static $schema() {
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

    static $columns() {
        return [
            'content',
            'author',
            'status',
            'created_at',
            'updated_at'
        ];
    }

    static $enableCreatedAtTimeStamp() {
        return true;
    }

    static $enableUpdatedAtTimeStamp() {
        return true;
    }

    static $addStory(story) {
        let story = new Story();
        story.content = story.content;
        story.author = story.author;
        story.status = Story.STATUS_PUBLISH;
        story.save()
            .then((result) => {
                if (story.cats) {
                    return StoryTerms.$addStoryTerms(result.insertId, story.cats);
                }

                return true;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

Story.STATUS_PUBLISH = 'publish';
Story.STATUS_HIDDEN = 'hidden';

module.exports.Story = Story;