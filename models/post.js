const { BaseModel } = include('models/base-model');
const { config } = include('config/master');
const { Util } = include('includes/util');

class Post extends BaseModel {

    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['posts'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['content', 'author', 'status'],
            properties: {
                content: { type: 'string', minLength: 8, maxLength: 10000 },
                author: { type: 'number' },
                status: { type: 'string' }
            }
        };
    }

    $beforeInsert(queryContext) {
        let currMySQLDateTime = Util.getCurrMysqlDateTime();
        this.created_at = currMySQLDateTime;
        this.updated_at = currMySQLDateTime;
    }

    $beforeUpdate() {
        this.updated_at = Util.getCurrMysqlDateTime();
    }

    static validatePostCatInput(postCats) {
        let splitCats = postCats.split(',');

        if (splitCats.length === 0)
            return true;

        let filteredCats = splitCats.filter((catID) => {
            return (parseInt(catID) !== NaN) ? true : false;
        });

        return (filteredCats.length) ? true : false;
    }
}

Post.STATUS_PUBLISH = 'publish';
Post.STATUS_HIDDEN = 'hidden';

module.exports.Post = Post;