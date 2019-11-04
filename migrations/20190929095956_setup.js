const { config } = require('../config/master');

exports.up = function (knex) {
    return knex.schema.createTable(config['db']['table_prefix'] + config['db']['table']['users'], (table) => {
        table.increments('id');
        table.string('user_name', 60).notNullable();
        table.string('pass', 60).nullable();
        table.timestamps();
        table.unique('user_name');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['error_log'], (table) => {
        table.increments('id');
        table.text('error').notNullable();
        table.string('file_info', 30);
        table.datetime('created_at').defaultTo(knex.fn.now(6));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable(config['db']['table']['users']);
};