const { Model } = absRequire('core/model/model');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');
const { MaskDBQuery } = absRequire('core/db/query');

class Tax extends Model {

    static $getTableName() {
        return config['db']['table_prefix'] + config['db']['table']['tax'];
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
            'name',
            'slug'
        ];
    }

    static isCatIDInputValid(catIDs) {
        let catIDsArr = catIDs.split(',');
        for (var i = 0; i < catIDsArr.length; i++) {
            if (Util.$containsNonNumberCharacter(catIDsArr[i]))
                return false;
        }

        return true;
    }

    static getTerms(tax) {
        let q = new MaskDBQuery();
        let { TaxTerms } = absRequire('models/tax-terms');
        let taxTbl = Tax.$getTableName();
        let taxTermsTbl = TaxTerms.$getTableName();
        let taxTblPK = Tax.$getPKColumnName();
        let taxTermsTblPK = TaxTerms.$getPKColumnName();

        return q.select([taxTermsTbl + '.' + taxTblPK, taxTermsTbl + '.term', taxTermsTbl + '.slug'])
            .from(taxTbl)
            .innerJoin(taxTermsTbl, taxTbl + '.' + taxTblPK + '=' + taxTermsTbl + '.tax_id')
            .where([taxTbl + '.slug', '=', tax])
            .orderBy(taxTermsTbl + '.' + taxTermsTblPK)
            .execute()
            .then((cats) => {
                return cats;
            }).catch((err) => {
                console.log(err);
                return false;
            });
    }

    static getCats() {
        return Tax.getTerms(Tax.TAX_CATEGORY);
    }

    static getHashTags() {
        return Tax.getTerms(Tax.TAX_HASHTAG);
    }

}

Tax.TAX_CATEGORY = 'category';
Tax.TAX_HASHTAG = 'hashtag';

module.exports.Tax = Tax;