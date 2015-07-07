'use strict';

require('../../env-setup');

var syncData = require('./jds-mock-sync-data');
var jobData = require('./jds-mock-job-data');
var patientData = require('./jds-mock-identifier-data');
var identifierToJpidMap = patientData.identifierToJpidMap;
var jpidRegEx = new RegExp('[0-9,A-F]{8}(?:-[0-9,A-F]{4}){3}-[0-9,A-F]{12}');

var _ = require('underscore');
var inspect = require(global.VX_UTILS + 'inspect');
var bodyParser = require('body-parser');

var log = require('bunyan').createLogger({ name: 'JDS' });
var port = require('yargs').usage('Usage: $0 --port <port>')
                           .demand('port')
                           .argv.port;

var app = require('express')().use(bodyParser.json())
                              .use(bodyParser.urlencoded({ extended: true }))
                              .use(require('multer')());

// ROUTES

app.get('/status/sync/:jpid', function(req, res) {
    log.info('-------- Getting Sync Status --------');
    log.info(req.params.jpid);
    if (typeof patientData[req.params.jpid] === 'undefined') {
        return res.status(404).send(req.params.jpid + ' cannot be found');
    }
    var dfn = patientData[req.params.jpid][0].split(';')[1];
    res.json(syncData(req.params.jpid, dfn));
});

app.post('/status/sync/:jpid', function(req, res) {
    log.info('-------- Saving Sync Status --------');
    log.info(req.params.jpid);
    log.info(inspect(req.body));
    res.sendStatus(200);
});

app.get('/status/job/:jpid/:rootJobId?', function(req, res) {
    log.info('-------- Getting Job States ---------');
    log.info('JPID: ' + req.params.jpid);
    if (typeof req.params.rootJobId === 'undefined') {
        log.info('(jds-mock-job-data only contains one root job, defaulting to rootJobId: 4, for three JPIDs)');
    }
    log.info('rootJobId: ' + req.params.rootJobId);

    var jsonResponse = jobData(req.params.rootJobId || '4')[req.params.jpid];

    if (typeof jsonResponse !== 'undefined') {
        res.json(_.filter(jsonResponse, function(item) {
            return item.rootJobId === (req.params.rootJobId || item.rootJobId);
        }));
    } else {
        res.json([]);
    }
});

app.post('/status/job', function(req, res) {
    log.info('-------- Storing new job state --------');
    log.info(inspect(req.body));
    res.json(req.body);
});

app.get('/patientIdentifiers/:identifier', function(req, res) {
    log.info('-------- Requested identifiers for ' + req.params.identifier + '---------');
    var identifier = req.params.identifier;

    var jpid = jpidRegEx.test(identifier)?identifier:identifierToJpidMap[identifier];

    if (typeof jpid === 'undefined' || typeof patientData[jpid] === 'undefined') {
        var notFoundMsg = jpidRegEx.test(identifier)?'JPID':'Patient identifier';
        res.status(404).send(notFoundMsg + ' not found. [' + identifier + ']');
    } else {
        res.json({
            'patientIdentifiers': patientData[jpid],
            'jpid': jpid
        });
    }
});

app.post('/patientIdentifiers/:jpid?', function(req, res) {
    log.info('-------- Storing Patient Identifiers ---------');
    log.info(inspect(req.body));
    log.info(req.body.patientIdentifiers[0]);
    var knownJpidRegEx = new RegExp('21EC2020-3AEA-4069-A2DD-(?:A{12}|B{12}|08002B30309D)');
    var jpid, status;
    var conflicts = {
        'conflictCount': 0
    };
    var newIdentifierCount = req.body.patientIdentifiers.length;

    _.forEach(req.body.patientIdentifiers, function(identifier) {
        var knownJpid = identifierToJpidMap[identifier];
        if (typeof knownJpid !== 'undefined') {
            newIdentifierCount--;
            conflicts[identifier] = patientData[knownJpid];
            if (knownJpid !== (req.params.jpid || knownJpid)) {
                conflicts[identifier] = knownJpid;
                conflicts[req.params.jpid] = patientData[req.params.jpid];
                conflicts.conflictCount++;
            }
            if ((jpid || knownJpid) !== knownJpid) {
                conflicts[identifier] = patientData[knownJpid];
                conflicts.conflictCount++;
            } else {
                jpid = knownJpid;
            }
        }
    });

    jpid = jpid || req.params.jpid || '21EC2020-3AEA-4069-A2DD-FFFFFFFFFFFF';
    if (conflicts.conflictCount) {
        res.status(409).json(conflicts);
    } else if (knownJpidRegEx.test(jpid)) {
        status = 202;
    } else {
        status = 201;
    }
    req.body.jpid = jpid;
    req.body.patientIdentifiers = _.union(req.body.patientIdentifiers, patientData[jpid]);
    log.info(jpid);
    res.status(newIdentifierCount?status:200).json(req.body);
});

app.post('/operational/data', insertOperationalData);
app.post('/patient/data', insertPatientData);

function insertOperationalData(req, res) {
    log.info('-------- Stored Operational Data --------');
    log.info(inspect(req.body));
    res.send(req.body);
}

function insertPatientData(req, res) {
    log.info('-------- Stored Patient Data --------');
    log.info(inspect(req.body));
    res.send(req.body);
}

app.listen(port);
log.info('Mock JDS endpoint listening on port %s', port);