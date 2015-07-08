'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv;

require('../../env-setup');
var bodyParser = require('body-parser');

var express = require('express');

var config = require(global.OSYNC_ROOT + 'worker-config');
var logUtil = require(global.OSYNC_UTILS + 'log');
var pollerUtil = require(global.OSYNC_UTILS + 'poller-utils');
var handler = require(global.OSYNC_HANDLERS + 'opportunistic-sync-request/opportunistic-sync-request');
logUtil.initialize(config.loggers);
var log = logUtil.get('opportunistic-sync-endpoint');

var environment = pollerUtil.buildEnvironment(log, config);

var app = express();
app.use(bodyParser.json());
var port = argv.port;

app.post('/osync/sync', handler.handle.bind(log, config, environment));
app.get('/osync/sync', handler.handle.bind(log, config, environment));


app.get('/ping', function(req, res) {
    res.send('ACK');
});

app.listen(port);
log.info('opportunistic-sync-request endpoint listening on port %s', port);

log.info('opportunistic-sync-request endpoint: Calling initialSync...');
handler.handle(log, config, environment);