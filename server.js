global.base_dir = __dirname;
global.abs_path = function (path) {
    return base_dir + path;
}
global.absRequire = function (file) {
    return require(abs_path('/' + file));
}

process.env.TZ = 'Asia/Kolkata';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { config } = absRequire('config/master');
const { Util } = absRequire('core/util');
const router = express.Router();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * Index router handler
 */

app.use(function (req, res, next) {
    //Set the headers for CORS
    res.header('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    if (req.originalUrl === '/')
        return res.send('Mask API Engine v1.0');

    next();
});


/*
 * API Routes
 */

app.use('/api/user', require('./api/user'));
// app.use('/api/post', require('./api/post'));


/*
 * Router handler for non-existent resource - 404 response
 */

app.use((req, resp) => {
    return Util.die(resp, { status: 'error', msg: 'The resource you are trying to access does not exist' }, 404);
});

//Main listening port
app.listen(config.app_port, function () {
    console.log('Mask API Engine started in port: ' + config.app_port);
});

module.exports = app;