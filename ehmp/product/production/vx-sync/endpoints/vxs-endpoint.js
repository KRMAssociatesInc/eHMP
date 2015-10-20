'use strict';


var port = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv.port;

require('../env-setup');
var bodyParser = require('body-parser');
var multer = require('multer');

var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
var log = logUtil.initialize(config.loggers).get('sync-endpoint');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var environment = pollerUtils.buildEnvironment(log, config);
var registerSyncAPI = require(global.VX_ENDPOINTS + 'sync-request/sync-request-endpoint');
var registerOPDAPI = require(global.VX_ENDPOINTS + 'operational/operational-sync-endpoint');
var registerDocAPI = require(global.VX_ENDPOINTS + 'documents/document-retrieval-endpoint');
var registerErrorAPI = require(global.VX_ENDPOINTS + 'error-handling/error-endpoint');

process.on('uncaughtException', function(err){
    console.log(err);
    console.log(err.stack);
});


var app = require('express')().use(bodyParser.json())
    .use(multer())
    .use(bodyParser.urlencoded({
        'extended': true
    }));

registerSyncAPI(log, config, environment, app);
registerDocAPI(log,config,environment, app);
registerOPDAPI(log,config,environment, app);
registerErrorAPI(log,config,environment, app);
app.get('/ping', function(req, res) {
        res.send('ACK');
    });
// End setup of endpoints

app.listen(port);
log.info('VXS endpoints listening on port %s', port);