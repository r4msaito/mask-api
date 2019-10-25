const { config } = require('./config/master');

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: config['db']['host'],
            database: config['db']['name'],
            user: config['db']['username'],
            password: config['db']['pass']
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: config['db']['table']['prefix'] + 'knex_migrations'
        }
    },

    staging: {
        client: 'mysql2',
        connection: {
            host: config['db']['host'],
            database: config['db']['name'],
            user: config['db']['username'],
            password: config['db']['pass']
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: config['db']['table']['prefix'] + 'knex_migrations'
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: config['db']['host'],
            database: config['db']['name'],
            user: config['db']['username'],
            password: config['db']['pass']
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: config['db']['table']['prefix'] + 'knex_migrations'
        }
    }

};