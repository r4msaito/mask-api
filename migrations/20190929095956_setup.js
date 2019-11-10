const { config } = require('../config/master');

exports.up = function(knex) {
    return knex.schema.createTable(config['db']['table_prefix'] + config['db']['table']['users'], (table) => {
        //users
        table.increments('id').unsigned;
        table.string('user_name', 60).notNullable();
        table.string('pass', 60).nullable();
        table.timestamps();
        table.unique('user_name');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['posts'], (table) => {
        //posts
        table.increments('id');
        table.text('content', 'longtext');
        table.integer('author').unsigned();
        table.foreign('author').references(config['db']['table_prefix'] + config['db']['table']['users'] + '.id');
        table.string('status', 10);
        table.timestamps();
    }).createTable(config['db']['table_prefix'] + config['db']['table']['post_comments'], (table) => {
        //post comments
        table.increments('id');
        table.text('content', 'mediumtext').notNullable();;
        table.integer('author').unsigned();
        table.timestamps();
    }).createTable(config['db']['table_prefix'] + config['db']['table']['posts_cat'], (table) => {
        //cats
        table.increments('id');
        table.string('slug', 100).notNullable();
        table.string('name', 100).notNullable();
        table.unique('slug');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['posts_cat_rel'], (table) => {
        //posts cat rel
        table.increments('id');
        table.integer('post_id').unsigned().notNullable();
        table.integer('cat_id').unsigned().notNullable();
        table.foreign('post_id').references(config['db']['table_prefix'] + config['db']['table']['posts'] + '.id');
        table.foreign('cat_id').references(config['db']['table_prefix'] + config['db']['table']['posts_cat'] + '.id');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['user_post_cat_rel'], (table) => {
        //user cat rel
        table.increments('id');
        table.integer('user_id').unsigned().notNullable();
        table.integer('cat_id').unsigned().notNullable();
        table.foreign('user_id').references(config['db']['table_prefix'] + config['db']['table']['users'] + '.id');
        table.foreign('cat_id').references(config['db']['table_prefix'] + config['db']['table']['posts_cat'] + '.id');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['posts_like'], (table) => {
        //posts like
        table.increments('id');
        table.integer('post_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('post_id').references(config['db']['table_prefix'] + config['db']['table']['posts'] + '.id');
        table.foreign('user_id').references(config['db']['table_prefix'] + config['db']['table']['users'] + '.id');
        table.datetime('created_at');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['posts_share_log'], (table) => {
        //posts share log
        table.increments('id');
        table.integer('post_id').unsigned().notNullable();
        table.string('platform', 15).notNullable();
        table.foreign('post_id').references(config['db']['table_prefix'] + config['db']['table']['posts'] + '.id');
    }).createTable(config['db']['table_prefix'] + config['db']['table']['error_log'], (table) => {
        //error_log
        table.increments('id');
        table.text('error').notNullable();
        table.string('file_info', 30);
        table.datetime('created_at').defaultTo(knex.fn.now(6));
    }).then((result) => {
        return knex(config['db']['table_prefix'] + config['db']['table']['posts_cat']).insert([
            { slug: 'kasamusa', name: 'Kasamusa' },
            { slug: 'art', name: 'Art' },
            { slug: 'social', name: 'Social' },
            { slug: 'technology', name: 'Technology' }
        ]);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists(config['db']['table']['users']);
};