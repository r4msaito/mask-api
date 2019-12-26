const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');

class Tax extends Model {

    static getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['tax'];
    }

    static schema() {
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

    columns() {
        return [
            'name',
            'slug'
        ];
    }

    static isCatIDInputValid(catIDs) {
        let catIDsArr = catIDs.split(',');
        for (var i = 0; i < catIDsArr.length; i++) {
            if (Util.containsNonNumberCharacter(catIDsArr[i]))
                return false;
        }

        return true;
    }

    static getCats() {
        
    }

}

module.exports.Tax = Tax;