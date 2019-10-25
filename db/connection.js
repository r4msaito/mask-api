const { config } = include('config/master');

const dbConnection = require('knex')({
    client: 'mysql2',
    connection: {
        host: config['db']['host'],
        user: config['db']['username'],
        password: config['db']['pass'],
        database: config['db']['name']
    }
});

module.exports.dbConnection = dbConnection;