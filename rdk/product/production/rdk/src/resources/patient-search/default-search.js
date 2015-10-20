'use strict';

var async = require('async');
var VistaJS = require('../../VistaJS/VistaJS');
var searchUtil = require('./results-parser');
var searchMaskSsn = require('./search-mask-ssn');

module.exports.apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [],
        responseMessages: []
    }
};


module.exports.getMyCPRS = function(req, res) {
    req.logger.debug('default search invoked');
    getDefaultSearchPrefs(req, res);
};

function getDefaultSearchPrefs(request, response) {
    var config = getVistaConfig(request);
    VistaJS.callRpc(request.logger, config, 'HMPCRPC RPC', {
        '"command"': 'getDefaultPatientList'
    }, function(err, result) {
        result = JSON.parse(result);
        parsePatientList(request, response, result);
    });
}

function parsePatientList(request, response, rpcPatientList) {
    var resultList = rpcPatientList.data.patients || [];
    var parsedList = [];
    var callCount = 0;
    async.each(resultList, function(patient, callback) {
        var currentCall = ++callCount;
        var patientAttr = patient.pid.split(';');
        getDemographics(request, patientAttr[1], patientAttr[0], function(result) {
            if (result !== undefined && result !== null && result !== {}) {
                if (patient.roomBed) {
                    result.roomBed = patient.roomBed;
                }
                if (patient.locationName) {
                    result.locationName = patient.locationName;
                }
                if(result.ssn) {
                    result.ssn = searchMaskSsn.maskSsn(result.ssn);
                }
            }
            parsedList[currentCall - 1] = result;
            callback();
            request.logger.debug('call ' + currentCall + ' completed with ' + patientAttr[0]);
        });
    }, function(err) {
        if (err) {
            response.status(500).rdkSend({
                'data': {
                    'items': []
                },
                message: err
            });
        } else {
            response.rdkSend({
                'data': {
                    'items': parsedList
                }
            });
        }
    });
}

function getDemographics(request, patientId, site, callback) {
    if (patientId === null) {
        return callback(null);
    }
    request.app.subsystems.jdsSync.getPatient(site + ';' + patientId, request, function(err, data) {
        if (err) {
            request.logger.warn('An error occurred retrieving patient ' + site + ';' + patientId);
            return callback(null);
        }
        request.logger.debug('Received response:');
        request.logger.debug(data);

        var patient = {};
        if (data.data && data.data.data) {
            data = data.data;
        }
        if (data.data && data.data.currentItemCount && data.data.items) {
            if (data.data.currentItemCount >= 1) {
                patient = data.data.items[0];
                patient = searchUtil.transformPatient(patient);
            }
        } else {
            request.logger.warn('Unable to find patient ' + site + ';' + patientId);
        }
        return callback(patient);
    });
}

function getVistaConfig(request) {
    //get user's site
    var site = request.session.user.site;
    //extract vista site configuration
    if (!request.app.config.vistaSites[site]) {
        request.logger.error('No Vista Site configuration found for user ' + request.session.user.accessCode + ' at site ' + site);
    }

    //merge them together
    var config = searchUtil.merge(request.app.config.rpcConfig, request.app.config.vistaSites[site]);
    config.siteCode = site;
    config.accessCode = request.session.user.accessCode;
    config.verifyCode = request.session.user.verifyCode;
    return config;
}


// below: _ exports for unit testing only
module.exports._getVistaConfig = getVistaConfig;
