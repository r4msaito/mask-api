const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');

class TaxTerms extends Model {

    static $getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['tax_terms'];
    }

    static $schema() {
        return {
            name: {
                required: true,
                type: 'string',
                max: 30
            },
            slug: {
                required: true,
                type: 'string',
                max: 20,
                unique: true
            }
        };
    }

    static $columns() {
        return [
            'term',
            'slug',
            'tax_id'
        ];
    }

}

module.exports.TaxTerms = TaxTerms;