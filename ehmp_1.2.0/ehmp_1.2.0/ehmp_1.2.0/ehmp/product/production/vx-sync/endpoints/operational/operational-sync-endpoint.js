'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv;

require('../../env-setup');
var bodyParser = require('body-parser');

var express = require('express');

var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
var pollerUtil = require(global.VX_UTILS + 'poller-utils');
var handler = require('./operational-sync-endpoint-handler');
logUtil.initialize(config.loggers);
var log = logUtil.get('operational-endpoint');

var environment = pollerUtil.buildEnvironment(log, config);

var app = express();
app.use(bodyParser.json());
var port = argv.port;

app.post('/data/load', handler.doLoad.bind(null, log, environment));
app.get('/data/doLoad', handler.doLoad.bind(null, log, environment));


app.get('/ping', function(req, res) {
    res.send('ACK');
});

app.listen(port);
log.info('operational-sync-request endpoint listening on port %s', port);

log.info('operational-sync-request endpoint: Calling initialOPDSync...');
handler.initialOPDSync(log, config, environment);

config.addChangeCallback(function(){
    log.info('operational-sync-endpoint  Config file change, reinitializing environment');
    environment = pollerUtil.buildEnvironment(log, config);
    app.post('/data/load', handler.doLoad.bind(null, log, environment));
    app.get('/data/doLoad', handler.doLoad.bind(null, log, environment));
}, false);

config.addChangeCallback(function() {
    log.info('operational-sync-endpoint  Config file change, subscribing to OPD');
    handler.initialOPDSync(log, config, environment);
});