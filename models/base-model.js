const dbConnection = include('db/connection');
const { Model } = require('objection');

Model.knex(dbConnection);

class BaseModel extends Model {

}

module.exports.BaseModel = BaseModel;