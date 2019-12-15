const { config } = absRequire('config/master');
const mysql2 = require('mysql2');

module.exports.maskDBConnection = mysql2.createConnectionPromise({
    host: config['db']['host'],
    user: config['db']['username'],
    password: config['db']['pass'],
    database: config['db']['name']
});