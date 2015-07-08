'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv;

require('../../env-setup');
var async = require('async');
var _ = require('underscore');
var inspect = require(global.VX_UTILS + 'inspect');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var config = require(global.VX_ROOT + 'worker-config');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);
var log = logUtil.get('writeback-endpoint', 'host');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');

var PublisherRouter = require(global.VX_JOBFRAMEWORK + 'publisherRouter');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

var port = argv.port;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(multer());

var publisherRouter = new PublisherRouter(logUtil.getAsChild('writeback', log), config);
var jds = new JdsClient(logUtil.getAsChild('jds', log), config);

app.post('/writeback', function(req, res) {
    log.info('-------- Writeback --------');
    log.info(inspect(req.body));

    var data = req.body;

    if (_.isEmpty(data) || _.isEmpty(data.patientIdentifier || _.isEmpty(data.patientIdentifier.type) || _.isEmpty(data.patientIdentifier.value))) {
        return res.status(400).send('No valid value for patientIdentifier');
    }

    if (_.isEmpty(data.dataDomain)) {
        return res.status(400).send('No valid value for dataDomain');
    }

    if (!data.record) {
        return res.status(400).send('No value for record');
    }

    var jobToSave = jobUtil.createStoreRecord(data.patientIdentifier, data.dataDomain, data.record);
    var jobToPublish = jobUtil.createPublishVxDataChange(data.patientIdentifier, data.dataDomain, data.record);

    async.series({
        store: function(callback) {
            jds.storePatientDataFromJob(jobToSave, callback);
        },
        publish: function(callback) {
            publisherRouter.publish(jobToPublish, callback);
        }
    }, function(error) {
        if (error !== 200) {
            return res.status(500).send({
                error: 'Unable to handle publish writeback',
                data: jobToPublish
            });
        }

        res.status(200).send(jobToSave);
    });
});

app.listen(port);
log.warn('writeback endpoint listening on port %s', port);