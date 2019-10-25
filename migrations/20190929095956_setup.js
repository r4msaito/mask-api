const { config } = require('../config/master');

exports.up = function (knex) {
    return knex.schema.createTable(config['db']['table']['prefix'] + config['db']['table']['users'], (table) => {
        table.increments('id');
        table.string('user_name', 60).notNullable();
        table.string('pass', 60).nullable();
        table.datetime('last_login');
        table.timestamps();
        table.unique('user_name');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable(config['db']['table']['users']);
};