const { appConfig } = require('./includes/config');

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: appConfig.DB.HOST,
            database:appConfig.DB.NAME,
            user: appConfig.DB.USERNAME,
            password: appConfig.DB.PASS
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: appConfig.DB.TABLE.PREFIX + 'knex_migrations'
        }
    },

    staging: {
        client: 'mysql2',
        connection: {
            host: appConfig.DB.HOST,
            database:appConfig.DB.NAME,
            user:appConfig.DB.USERNAME,
            password:appConfig.DB.PASS
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName:appConfig.DB.TABLE.PREFIX + 'knex_migrations'
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: appConfig.DB.HOST,
            database: appConfig.DB.NAME,
            user: appConfig.DB.USERNAME,
            password: appConfig.DB.PASS
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: appConfig.DB.TABLE.PREFIX + 'knex_migrations'
        }
    }

};