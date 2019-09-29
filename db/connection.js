const { appConfig } = include('includes/config');

const dbConnection = require('knex')({
    client: 'mysql2',
    connection: {
        host: appConfig.DB.HOST,
        user: appConfig.DB.USERNAME,
        password: appConfig.DB.PASS,
        database: appConfig.DB.NAME
    }
});

module.exports = dbConnection;