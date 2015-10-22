'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv;

require('../../env-setup');
var _ = require('underscore');
var inspect = require(global.VX_UTILS + 'inspect');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
var pidUtils = require(global.VX_UTILS + 'patient-identifier-utils');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
logUtil.initialize(config.loggers);
var log = logUtil.get('writeback-endpoint', 'host');
var pollerUtils = require(global.VX_UTILS + 'poller-utils');
var moment = require('moment');
var metastampUtil = require(global.VX_UTILS + 'metastamp-utils');
var enrichment = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-request-handler');
var storage = require(global.VX_HANDLERS + 'store-record-request/store-record-request-handler');
var uuid = require('node-uuid');

var environment = pollerUtils.buildEnvironment(log, config);
var port = argv.port;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(multer());

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

app.get('/ping', function(req, res) {
    res.send('ACK');
});

app.post('/writeback', function(req, res, next) {
    log.info('-------- Writeback --------');
    log.info(inspect(req.body));

    var data = req.body;
    //validate payload
    if(!validateRequest(log, data)) {
        res.status(400).send('Invalid record format. pid, uid and lastUpdateTime are required.');
        return next();
    }
    _constructPidFromRecord(log, data);
    var domain = uidUtils.extractDomainFromUID(data.uid);
    var patientIdentifier = pidUtils.create('pid', data.pid);
    data.stampTime = data.lastUpdateTime-1; //overwrite whatever was there before. Unsolicited update should be 1 second newer.
    var metricsObj = {'domain':domain, 'pid':data.pid, 'uid':data.uid, 'timer':'start', 'process':uuid.v4()};
    environment.metrics.debug('Writeback record', metricsObj);
    metricsObj.timer = 'stop';

    //generate and store metastamp
    var domainMetastamp = metastampUtil.metastampDomain({'data':{'items':[data]}}, data.stampTime, null);
    environment.jds.saveSyncStatus(domainMetastamp, patientIdentifier, function(error, response){
        if(!error) {
            if (response.statusCode >= 300) {
                log.error('Could not store metastamp in JDS %j', domainMetastamp);
                environment.metrics.debug('Writeback record in Error', metricsObj);
                res.status(500).send('Could not store record metastamp');
                return next();
            }
            //run record enrichment
            enrichment.transform(log, config, environment, domain, data, function(error, record) {
                if(error) {
                    log.error('Could not transform record %j because of %j', record, error);
                    environment.metrics.debug('Writeback record in Error', metricsObj);
                    res.status(500).send('Error enriching VPR record');
                    return next();
                }
                //store record in JDS
                storage.store(log, environment, domain, patientIdentifier, record, function(error, jdsrecord) {
                    if(error) {
                        log.error('Could not complete record storage of %j because of %j', jdsrecord, error);
                        environment.metrics.debug('Writeback record in Error', metricsObj);
                        res.status(500).send('Record storage error');
                        return next();
                    }
                    res.status(200).json(record);
                    environment.metrics.debug('Writeback record', metricsObj);
                    return next();
                });
            });
        } else {
            log.error('Could not generate metastamp for record %j because of %j', data, error);
            res.status(500).send('Could not store record');
            environment.metrics.debug('Writeback record in Error', metricsObj);
            return next();
        }
    });
});

app.listen(port);
log.warn('writeback endpoint listening on port %s', port);

function validateRequest(log, record) {
    if(_.isUndefined(record)) {
        log.error('Record is undefined');
        return false;
    }
    if(_.isUndefined(record.uid)) {
        log.error('Record does not contain a uid %j', record);
        return false;
    } else {
        var uidParts = uidUtils.extractPiecesFromUID(record.uid);
        if(_.isUndefined(uidParts.localId)) {
            log.error('UID is malformed %j', record.uid);
            return false;
        }
        if(_.isUndefined(uidParts.patient)) {
            log.error('UID is malformed %j', record.uid);
            return false;
        }
        if(_.isUndefined(uidParts.site)) {
            log.error('UID is malformed %j', record.uid);
            return false;
        }
        if(_.isUndefined(uidParts.domain)) {
            log.error('UID is malformed %j', record.uid);
            return false;
        }
    }
    if(_.isUndefined(record.lastUpdateTime)) {
        log.error('Record does not have an update time %j', record);
        return false;
    } else {
        if(!moment(record.lastUpdateTime, 'YYYYMMDDHHmmss').isValid()) {
            log.error('lastUpdateTime is malformed %j', record.lastUpdateTime);
            return false;
        }
    }
    return true;
}

// internal utility function
// assumption: record is already validated
function _constructPidFromRecord(log, record) {
    if(_.isUndefined(record.pid)) {
        log.debug('Record does not contain a pid %j', record);
    } else {
        if(!pidUtils.isIdFormatValid(['pid'], record.pid)) {
            log.debug('%s is not a valid pid', record.pid);
        }
        else {
            return; // we already had an valid pid in the request, just return
        }
    }
    var uidParts = uidUtils.extractPiecesFromUID(record.uid);
    record.pid = uidParts.site + ';'+ uidParts.patient;
    return;
}
