const { config } = absRequire('config/master');
const mysql2 = require('mysql2');

module.exports.maskDBConnection = mysql2.createPool({
    host: config['db']['host'],
    user: config['db']['username'],
    database: config['db']['name'],
    password: config['db']['pass'],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })