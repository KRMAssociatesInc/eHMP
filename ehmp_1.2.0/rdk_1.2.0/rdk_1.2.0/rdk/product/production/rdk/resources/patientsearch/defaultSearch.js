/*jslint node: true */
'use strict';

var async = require('async');
var VistaJS = require('../../VistaJS/VistaJS');
var searchUtil = require('./searchUtil');
var http = require('../../utils/http-wrapper/http');
var searchMaskSsn = require('./searchMaskSsn');

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
            response.json({
                'data': {
                    'items': []
                },
                msg: err
            });
        } else {
            response.json({
                'data': {
                    'items': parsedList
                },
                msg: null
            });
        }
    });
}

function getDemographics(request, patientId, site, callback) {
    if (patientId === null) {
        return callback(null);
    }
    var jdsServer = request.app.config.jdsServer;
    var endpoint = request.app.config.jdsSync.patientSelectPid;
    var uri = (endpoint.protocol || 'http') + '://' + jdsServer.host + ':' + jdsServer.port + endpoint.options.path + site + ';' + patientId;
    request.logger.debug('Calling remote data service ' + uri);
    var httpConfig = {
        protocol: endpoint.protocol,
        logger: request.logger,
        options: {
            hostname: jdsServer.host,
            port: jdsServer.port,
            method: 'GET',
            path: endpoint.options.path + site + ';' + patientId
        }
    };
    http.post(null, httpConfig, function(err, data) {
        if (err) {
            request.logger.warn('An error occurred retrieving patient ' + site + ';' + patientId);
            return callback(null);
        }
        request.logger.debug('Received response:\n' + data);
        try {
            data = JSON.parse(data);
        } catch (e) {
            request.logger.error(e);
            return callback(null);
        }

        var patient = {};
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
