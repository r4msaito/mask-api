const { BaseModel } = absRequire('models/base-model');
const { config } = absRequire('config/master');

class PostCatRel extends BaseModel {

    static get tableName() {
        return config['db']['table_prefix'] + config['db']['table']['post_cat_rel'];
    }

    static get jsonSchema() {
        return {
            required: ['post_id', 'cat_id'],
            properties: {
                id: { type: 'integer' },
                slug: { type: 'interger'},
                name: { type: 'integer'}
            }
        };
    }

    static refreshPostCatRelations(id, postCats) {
        return PostCatRel.removePostCatRelations(id).then((removedRelations) => {
            return PostCatRel.addPostCatRelations(id, postCats);
        });
    }

    static removePostCatRelations(id) {
        return PostCatRel.query().delete()
        .where('id', id);
    }

    static addPostCatRelations(id, postCats) {
        return PostCatRel.query().insert()
    }
}

module.exports.PostCatRel = PostCatRel;