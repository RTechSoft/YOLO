var express = require('express'),
    app = express(),

    config = require(__dirname + '/config/config'),
    logger = require(__dirname + '/lib/logger'),
    util = require(__dirname + '/helpers/util');

logger.log('info', 'initializing YOLO Backend. ENV = ', process.env['NODE_ENV']);

app.disable('x-powered-by');
app.use(require('body-parser')({uploadDir : config.temp_dir}));
app.use(require('cookie-parser')(config.cookie_secret));
app.use(require('response-time')());
app.use(require('compression')());
app.use(require('method-override')());
app.use(require(__dirname + '/lib/cors')('*'));
app.use(require(__dirname + '/config/router')(express.Router(), logger));

app.listen(config.port);

logger.log('info', 'Server listening on port : ', config.port);

module.exports = app;
