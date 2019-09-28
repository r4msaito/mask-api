const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const fs = require('fs');
const constants = require('./includes/constants');
const ServiceHelper = require('./includes/service-helper');

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

fs.readdirSync('./api').forEach((apiFile) => {
    let apiFileNoExt = apiFile.split('.')[0];
    let mount = '/api/' + apiFileNoExt;
    let func = require('./api/' + apiFileNoExt);
    app.use(mount, func);
});
 

/*
 * Router handler for non-existent resource - 404 response
 */

app.use(function(req, resp, next) {
    return ServiceHelper.die(resp, { status: 'error', msg: 'The resource you are trying to access does not exist' }, 404);
});

//Main listening port
app.listen(constants.APP_PORT, function() {
    console.log('Mask API Enginer started in port:' + constants.APP_PORT);
    return;
});

module.exports = app;