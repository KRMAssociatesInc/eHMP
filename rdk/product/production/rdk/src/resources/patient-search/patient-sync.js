'use strict';
var _ = require('underscore');
var fs = require('fs');
var util = require('util');
var crypto = require('crypto');
var moment = require('moment');
var _s = require('underscore.string');
var parseString = require('xml2js').parseString;
var searchUtil = require('./results-parser');
var http = require('../../utils/http');
var mvi = require('../../subsystems/mvi-subsystem');
var rdk = require('../../core/rdk');

var xml_1309 = fs.readFileSync(__dirname + '/xml/1309.xml').toString();

module.exports.apiDocs = {
    spec: {
        path: '/sync/mvi',
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.body('Patient', undefined, 'sync-mvi.Patient', undefined, 'true')
        ],
        responseMessages: []
    },
    models: {
        'sync-mvi.Patient': {
            required: ['id'],
            properties: {
                id: {
                    type: 'string',
                    description: 'patient\'s mvi id'
                },
                demographics: {
                    $ref: 'sync-mvi.Demographics'
                }
            }
        },
        'sync-mvi.Demographics': {
            required: [],
            properties: {
                familyName: {
                    type: 'string',
                    description: 'patient\'s last name'
                },
                fullName: {
                    type: 'string',
                    description: 'patient\'s full name in first middle last order'
                },
                displayName: {
                    type: 'string',
                    description: 'patient\'s full name in last,first middle order'
                },
                givenName: {
                    type: 'string',
                    description: 'patient\'s first and middle names'
                },
                genderName: {
                    type: 'string',
                    description: 'gender of patient'
                },
                genderCode: {
                    type: 'string',
                    description: 'gender code of patient'
                },
                ssn: {
                    type: 'string',
                    description: 'patient\'s full ssn'
                },
                dob: {
                    type: 'string',
                    description: 'date of birth in yyyymmdd format'
                }
            }
        }
    }
};

function getPatientFromMVI(request, processor, cb) {
    var config = request.app.config;
    var pid = request.body.pid || request.param('pid') || ''; //if !pid then error
    if (config.mvi.protocol !== 'http' && config.mvi.protocol !== 'https') {
        return;
    }

    //fill in query parameters
    var querySub = {};
    if (!pid) {
        request.logger.error('NO PID FOUND IN REQUEST');
        // console.log(util.inspect(request, {depth: 3}));
        cb({
            error: 'No patient id found',
            syncInProgress: false
        });
        return;
    } else {
        pid = pid + '^NI^200M^USVHA';
        request.logger.info('PID is ' + pid);
    }
    querySub = {
        firstname: request.session.user.firstname || '',
        lastname: request.session.user.lastname || '',
        id: pid,
        time: moment().format('YYYYMMDDHHmmss'),
        sender: config.mvi.senderCode,
        msgID: crypto.randomBytes(8).toString('hex') //16 bit ID small enough to be easily spoofed so using 64 bits
    };
    var soapRequest = _s.sprintf(xml_1309, querySub);
    //invoke service
    var httpConfig = mvi.getMVIHttpConfig(config, request.logger);

    http.post(soapRequest, config, httpConfig, function(err, data) {
        if (err) {
            request.logger.error('Received error response from MVI');
            cb( {
                error: 'Cannot connect to MVI.',
                syncInProgress: false
            });
        } else {
            parseString(data, function(err, result) {
                if (!err) {
                    processor(searchUtil.retrieveObjFromTree(result, ['Envelope', 'Body', 0, 'PRPA_IN201310UV02', 0]), cb); //throw away soap envelope
                } else {
                    request.logger.debug(util.inspect(err));
                    cb({
                        syncInProgress: false,
                        error: err
                    });
                }
            });
        }
    });
}

function getJDSPatientSyncStatus(request, response) {
    request.logger.debug('getJDSPatientSyncStatus is called');
    var pid = request.body.pid || ''; //if !pid then error
    request.app.subsystems.jdsSync.getPatientStatus(pid, request, function(err, result) {
        request.logger.debug(err);
        request.logger.debug(result);
        if (err) {
            request.logger.debug('error getting patient sync status');
            request.logger.debug(err);
            if (err === 404) {
                //PID is not synced
                var boundParseMVICorrespondingIDs = parseMVICorrespondingIDs.bind(this, request);
                getPatientFromMVI(request, boundParseMVICorrespondingIDs, function(status) {
                    response.rdkSend(status);
                });
            } else {
                request.logger.error('Error connecting to sync subsystem:');
                request.logger.error(err);
                response.status(500).rdkSend('There was an error processing your request. The error has been logged.');
            }
        } else {
            determineIfPatientIsSynced(result, request, response);
        }
    });
}

function determineIfPatientIsSynced(syncStatus, request, response) {
    request.logger.debug('determineIfPatientIsSynced called');
    var patientSynced = false;
    var syncInProgress = false;
    var status = 'ok';
    if (!syncStatus || !syncStatus.status) {
        request.logger.warn('unknown response from JDS Sync subsystem');
        return response.rdkSend({
            'status': 'Unknown response from JDS',
            'patientSynced': patientSynced,
            'syncInProgress': syncInProgress
        });
    }
    if (syncStatus.status === 200) {
        //PID is already in JDS
        //confirm that it is fully synced
        var boundedParseMVICorrespondingIDs = parseMVICorrespondingIDs.bind({}, request);
        getPatientFromMVI(request, boundedParseMVICorrespondingIDs, function(getPatientStatus) {
             status = getPatientStatus;
        });
        if (syncStatus.data && syncStatus.data.syncStatus) {
            if (syncStatus.data.syncStatus.inProgress) {
                patientSynced = false;
            }
            else if (_.isArray(syncStatus.data.jobStatus) && syncStatus.data.jobStatus.length > 0) { // not empty
                patientSynced = false;
            }
            else if (syncStatus.data.syncStatus.completedStamp) {
                patientSynced = true;
            }
        }
        request.logger.debug('Patient ' + request.pid + ' sync status is ' + patientSynced);
        if (!patientSynced) {
            syncInProgress = true;
        }

        response.rdkSend({
            'status': status,
            'patientSynced': patientSynced,
            'syncInProgress': syncInProgress
        });
    } else if (syncStatus.status === 404) {
        //PID is unknown
        var boundParseMVICorrespondingIDs = parseMVICorrespondingIDs.bind({}, request);
        getPatientFromMVI(request, boundParseMVICorrespondingIDs, function(mviStatus) {
            if (mviStatus.error) {
                status = mviStatus.error;
            }
            syncInProgress = mviStatus.syncInProgress;
            response.rdkSend({
                'status': status,
                'patientSynced': patientSynced,
                'syncInProgress': syncInProgress
            });
        });
    } else {
        response.rdkSend({
            'status': 'Unknown response from JDS',
            'patientSynced': patientSynced,
            'syncInProgress': syncInProgress
        });
    }
}

function syncJDSPatient(req, idList, cb) {
    var payload = {
        'pid': [],
        'edipi': null,
        'icn': null,
        'demographics': req.body.demographics
    };
    _.each(idList, function(element) {
        var idParts = element.split('^');
        var idType = searchUtil.determineIDType(element);
        if (idType === 'DFN') {
            payload.pid.push(idParts[2] + ';' + idParts[0]);
            req.logger.debug('DFN retrieved: ' + idParts[2] + ';' + idParts[0]);
        } else if (idType === 'ICN') {
            payload.icn = idParts[0];
            req.logger.debug('ICN retrieved: ' + idParts[0]);
        } else if (idType === 'EDIPI') {
            payload.edipi = idParts[0];
            req.logger.debug('EDIPI retrieved: ' + idParts[0]);
        } else if (idType === 'SSN' && !payload.demographics.ssn) {
            payload.demographics.ssn = idParts[0];
            req.logger.debug('SSN retrieved: ' + idParts[0]);
        }
    });
    req.logger.debug('calling demographicSync endpoint');
    req.logger.debug(util.inspect(payload));
    searchUtil.transformPatient(payload.demographics);
    req.app.subsystems.jdsSync.syncPatientDemographics(payload, req, function(err, data) {
        if (data) {
            try {
                data = JSON.parse(data);
            } catch(error) {
                req.logger.error(error);
                return cb({
                    syncInProgress: false,
                    error: 'Unknown error while syncing patient. Response not parseable.'
                });
            }
        }
        req.logger.debug(util.inspect(data));
        if (!err && data.success) {
            cb({
                syncInProgress: true,
                error: 'ok'
            });
        } else if (data && data.error && _.isArray(data.error.errors) && data.error.errors.length > 0 && data.error.errors[0].exception) {
            cb({
                syncInProgress: false,
                error: data.error.errors[0].exception
            });
        } else {
            cb({
                syncInProgress: false,
                error: 'Unknown error while syncing patient.'
            });
        }
    });
}

function getHmpHeader(req) {
    var hmp = _.clone(req.app.config.vxSyncServer),
        token = hmp.accessCode + ':' + hmp.verifyCode;

    token = new Buffer(token).toString('base64');
    return 'Basic ' + token;
}

function parseMVICorrespondingIDs(request, result, cb) {
    //first check if this is an error message
    var responseCode = result.controlActProcess[0].queryAck[0].queryResponseCode[0].$.code;
    if (responseCode === 'AE') {
        cb({
            syncInProgress: false,
            error: 'MVI could not fulfill request.'
        });
    } else if (responseCode === 'NF') {
        cb({
            syncInProgress: false,
            error: 'MVI could not find the id.'
        });
    } else {
        var patientIDList = result.controlActProcess[0].subject[0].registrationEvent[0].subject1[0].patient[0].id;
        var idList = _.map(patientIDList, function(value) {
            return value.$.extension;
        });
        syncJDSPatient(request, idList, cb);
    }
}

module.exports.getPatient = getJDSPatientSyncStatus;
module.exports._determineIfPatientIsSynced = determineIfPatientIsSynced;
