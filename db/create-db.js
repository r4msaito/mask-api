const mysql = require('mysql2');
const constants = require('../includes/constants');
const dbConn = require('./db-conn');
const createTables = require('./get-tables');

var conn = mysql.createConnection({
    host: constants.DB_HOST,
    user: constants.DB_USERNAME,
    password: constants.DB_PASS
});

conn.connect((connErr) => {
    if (connErr)
        throw connErr;

    conn.query('CREATE DATABASE IF NOT EXISTS ' + constants.DB_NAME, (queryErr) => {
        if (queryErr) {
            throw queryErr;
        } else {
            console.log('Database ' + constants.DB_NAME + ' successfully created!');

            //Create tables
            createTables();
        }
    });
});