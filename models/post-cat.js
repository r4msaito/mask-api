const { BaseModel } = include('models/base-model');
const { config } = include('config/master');

class PostCat extends BaseModel {

    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['post_cat'];
    }

    static get jsonSchema() {
        return {
            required: ['slug', 'name'],
            properties: {
                id: { type: 'integer' },
                slug: { type: 'string', minLength: 2, maxLength: 60 },
                name: { type: 'string', minLength: 2, maxLength: 60 }
            }
        };
    }

    static validatePostCatInput(postCats) {
        let splitCats = postCats.split(',');

        if (splitCats.length === 0)
            return true;

        let filteredCats = splitCats.filter((catID) => {
            return (isNaN(parseInt(catID))) ? false : true;
        });

        return (filteredCats.length) ? true : false;
    }
}

module.exports.PostCat = PostCat;