const { appConfig } = require('../includes/config');

exports.up = function(knex) {
    return knex.schema.createTable(appConfig.DB.TABLE.USERS, (table) => {
        table.increments('id');
        table.string('user_name', 60).notNullable();
        table.string('pass', 60).nullable();
        table.datetime('last_login');
        table.timestamps(true);
        table.unique('user_name');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(appConfig.DB.TABLE.USERS);
};