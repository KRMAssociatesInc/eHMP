'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv;

require('../../env-setup');
var bodyParser = require('body-parser');

var express = require('express');
var cron = require('node-schedule');

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

var rule = new cron.RecurrenceRule();
rule.dayOfWeek = [5,6,0,1,2,3,4];
rule.hour = Number(config.scheduledRunAtHour);
rule.minute = Number(config.scheduledRunAtMinutes);

log.info('opportunistic-sync-request endpoint: schedulejob...' + rule.hour);

//handler.handle(log, config, environment);

cron.scheduleJob(rule, function(){
    log.debug(rule);
    log.debug('starting handlers');
    handler.handle(log, config, environment);
});

//cron.scheduleJob("0 */10 * * * *", function(){
//    log.debug('Start handlers ...');
//    handler.handle(log, config, environment);
//});

