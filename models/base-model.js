const { dbConnection } = include('db/connection');
const { Model } = require('objection');
const { DBErrors } = require('objection-db-errors');

Model.knex(dbConnection);

class BaseModel extends DBErrors(Model) {
}

module.exports.BaseModel = BaseModel;