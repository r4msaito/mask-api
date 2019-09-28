const mysql = require('mysql2');
const constants = require('../mixins/constants');
const dbConn = require('./db-conn');
const createTables = require('./get-tables');

var conn = mysql.createConnection({
    host: constants.DB.HOST,
    user: constants.DB.USERNAME,
    password: constants.DB.PASS
});

conn.connect((connErr) => {
    if (connErr)
        throw connErr;

    conn.query('CREATE DATABASE IF NOT EXISTS ' + constants.DB.NAME, (queryErr) => {
        if (queryErr) {
            throw queryErr;
        } else {
            console.log('Database ' + constants.DB.NAME + ' successfully created!');

            //Create tables
            createTables();
        }
    });
});