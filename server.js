//requires
const express = require('express');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const app = express();
const constants = require('./includes/constants.js');
const util = require('./includes/util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/*
 * Index router handler
 */

app.use(function(req, res, next) {
    //Set the headers for CORS
    res.header('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    if (req.originalUrl === '/')
        return res.send('Mask API Engine');

    next();
});


/*
 * API Routes
 */

/*
 * Router handler for non-existent resource - 404 response
 */
app.use(function(req, resp, next) {
    return util.serviceDie(resp, { status: 'error', msg: 'The resource you are trying to access does not exist' }, 404);
});

//Main listening port
app.listen(constants.APP_PORT, function() {
    console.log('Mask API Enginer started in port:' + constants.APP_PORT);
    return;
});

module.exports = app;