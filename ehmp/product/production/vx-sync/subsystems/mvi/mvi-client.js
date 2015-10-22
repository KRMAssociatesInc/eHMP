'use strict';

var util = require('util');
var _ = require('underscore');
var request = require('request');
var querystring = require('querystring');
var inspect = require(global.VX_UTILS + 'inspect');
var errorUtil = require(global.VX_UTILS + 'error');
var objUtil = require(global.VX_UTILS+'object-utils');
var uuid = require('node-uuid');

var async = require('async');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');

function MviClient(log, metrics, config, jdsClient) {
    if (!(this instanceof MviClient)) {
        return new MviClient(log, metrics, config);
    }

    this.log = log;
    this.metrics = metrics;
    this.jds = jdsClient;
    this.mviConfig = config.mvi;
    this.rootConfig = config;
}

MviClient.prototype.lookup = function(patientIdentifier, callback) {
    var self = this,
        url;
    var process = uuid.v4();
    self.metrics.debug('Beginning CorrespondingId Lookup',{'subsystem':'MVI','action':'correspondingId','pid':patientIdentifier.value, 'process':process, 'timer':'start'});

    if (_.isEmpty(self.mviConfig)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No value passed for mvi configuration'));
    }

    if (_.isEmpty(patientIdentifier)) {
        return setTimeout(callback, 0, errorUtil.createFatal('No value passed for patientIdentifier'));
    }

    if (patientIdentifier.type === 'icn') {
        self.log.debug('icn received (%s).  Query MVI', patientIdentifier.value);
        url = util.format('%s://%s:%s%s?%s',
            self.mviConfig.protocol,
            self.mviConfig.host,
            self.mviConfig.port,
            self.mviConfig.path,
            querystring.stringify({
                icn: patientIdentifier.value
            }));
        self.log.debug('Lookup for patient: %s => %s', patientIdentifier.value, url);

        var options = {
            url: url,
            timeout: self.mviConfig.timeout
        };

        request(options, function(error, response, body) {
            if (error || response.statusCode === 500) {
                self.log.error('Unable to access MVI endpoint: %s', url);
                self.log.error(error);

                // This might work at a different time
                return callback(errorUtil.createTransient((error || body || 'Unknown Error'), 500));
            }

            // Bad Request - this will never return results
            if (response.statusCode === 400) {
                return callback(errorUtil.createFatal(body, 400));
            }

            // Not found - this will probably never return results
            if (response.statusCode === 404) {
                return callback(errorUtil.createFatal('Patient not found: ' + inspect(patientIdentifier), 404));
            }

            // Not found - this will probably never return results
            if (response.statusCode === 204) {
                self.log.debug('MviClient.lookup() unable to retrieve patient, probably unable to connect to MVI: Status Code: %s', response.statusCode);
                return callback(errorUtil.createFatal('Error retrieving patient: ' + inspect(patientIdentifier), 204));
            }

            var data;
            try {
                data = JSON.parse(body);
            } catch (parseError) {
                // Could not parse response - probably would work at a different time
                self.log.debug('MviClient.lookup(): Status Code: %s', response.statusCode);
                self.log.debug('MviClient.lookup(): Unable to parse JSON: %s', body);
                return callback(errorUtil.createTransient('Unable to parse JSON', 500));
            }

            self.log.debug('Got results for patient: %s', inspect(patientIdentifier));
            self.log.trace(inspect(data));

            self._parseRealMVIResponse(patientIdentifier, data, process, callback);
        });

        return;
    }

    if (patientIdentifier.type === 'pid') {
        self.jds.getOperationalDataPtSelectByPid(patientIdentifier.value, function(err, result, body) {
            if (!err) {
                if (body.data.items.length === 0) {
                    return callback('No IDs found for ' + patientIdentifier.value);
                }

                if (_.isUndefined(body.data.items[0].icn)) {
                    return callback(err, {
                        ids: [{
                            type: 'pid',
                            value: body.data.items[0].pid
                        }]
                    });
                }

                var icn = body.data.items[0].icn;
                self.jds.getOperationalDataPtSelectByIcn(icn, function(err, result, body) {
                    // console.log(body);
                    if (!err) {
                        //get pids
                        var patientIdentifiers = _.map(body.data.items, function(item) {
                            return {
                                type: 'pid',
                                value: item.pid
                            };
                        });
                        patientIdentifiers.push({
                            type: 'icn',
                            value: icn
                        });


                        self.log.debug('pid receieved.  Query VistA MVI RPC');
                        var hashDfn = patientIdentifier.value.split(';');
                        self.log.debug('query VistA ' + hashDfn[0] + ' for patient ' + hashDfn[1]);
                        var  splitSites = JSON.parse(JSON.stringify(self.rootConfig.vistaSites));
                        for (var key in splitSites){
                           splitSites[key]=objUtil.removeProperty(objUtil.removeProperty(splitSites[key],'accessCode'),'verifyCode');
                        }
                        self.log.debug(splitSites);
                        if (typeof self.rootConfig.vistaSites[hashDfn[0]] === 'undefined') {
                            self.log.debug('PID provided and VistA instance is unknown');
                            return callback(errorUtil.createFatal('Unknown source instance.  Cannot query VistA MVI RPC', 400));
                        }

                        var siteConfig = self.rootConfig.vistaSites[hashDfn[0]];
                        if (!siteConfig) {
                            return callback('No Vista Site Configuration for' + hashDfn[0]);
                        }

                        var rpcConfig = _.clone(siteConfig);
                        var stationNumber = self.getStationNumber(hashDfn[0]);
                        if (!stationNumber) {
                            self.log.error('mvi-client.lookup no station number found for' + hashDfn[0]);
                            return callback('No stationNumber for' + hashDfn[0]);
                        }

                        var vista = new VistaClient(self.log, self.metrics, rpcConfig);
                        vista.getIds(hashDfn[0], hashDfn[1], stationNumber, function(error, result) {
                            if (result) {
                                self._parseVistaMVIResponse(patientIdentifier, result, process, function(err, result) {
                                    if (!err) {
                                        patientIdentifiers = patientIdentifiers.concat(result.ids);
                                        //filter duplicates
                                        patientIdentifiers = _.uniq(patientIdentifiers, false, function(item) {
                                            return item.value;
                                        });
                                    }
                                    callback(null, {
                                        ids: patientIdentifiers
                                    });
                                });
                            } else {
                                callback(null, {
                                    ids: patientIdentifiers
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

MviClient.prototype._parseRealMVIResponse = function(queryPatientIdentifier, data, process, callback) {
    var self = this;
    self.metrics.trace('Parsing MVI Response', {'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process});
    var responseCode;
    try {
        responseCode = data.controlActProcess.queryAck.queryResponseCode.code || 'ER';
    } catch (e) {
        self.log.error(e);
        responseCode = 'ER';
    }
    var idList = [];

    switch (responseCode) {
        case 'OK':
            try {
                var mviPatientIds = data.controlActProcess.subject[0].registrationEvent.subject1.patient.id || [];
                idList = _.pluck(mviPatientIds, 'extension');
                self._makePatientIdentifiers(queryPatientIdentifier, idList, process, callback);
            } catch (e) {
                self.log.error(e);
                self.metrics.debug('MVI processing error',{'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
                callback('No patient identifiers found in JSON structure');
            }
            break;
        case 'ER':
            self.metrics.debug('MVI processing error',{'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
            callback('MVI response in unknown structure');
            break;
        case 'NF':
            self.metrics.debug('MVI processing error',{'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
            callback('MVI could not find patient');
            break;
        case 'AE':
            self.metrics.debug('MVI processing error',{'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
            callback('MVI was unable to fulfill request');
            break;
        default:
            self.metrics.debug('MVI processing error',{'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
            callback('MVI gave unknown response code ' + responseCode);
    }
};

MviClient.prototype._parseVistaMVIResponse = function(queryPatientIdentifier, data, process, callback) {
    var self = this;
    self.metrics.trace('Parsing MVI Response', {'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process});
    var idLines = data.split('\r\n') || [];
    self.log.debug('idLines: ' + idLines);
    self._makePatientIdentifiers(queryPatientIdentifier, idLines, process, callback);
};

MviClient.prototype._makePatientIdentifiers = function(queryPatientIdentifier, idStrings, process, callback) {
    var self = this;
    var idList = [];

    if (_.isArray(idStrings) && idStrings.length > 0) {
        self.log.debug('MVI List IDs' + util.inspect(idStrings));
        async.every(idStrings, function(mviID, cb) {
            //ID^IDTYPE^AssigningAuthority^AssigningFacility^IDStatus
            var idParts = mviID.split('^');
            if (idParts[0] === '-1' || idParts.length <= 1) { //incorrect query format or unknown id
                return cb(true);
            }
            if (idParts[1] === 'NI' && (idParts[2] === 'USVHA' || idParts[3] === 'USVHA')) {
                self.log.debug(mviID + ' is ICN');
                idList.push({
                    type: 'icn',
                    value: idParts[0]
                });
            } else if (idParts[1] === 'NI' && (idParts[2] === 'USDOD' || idParts[3] === 'USDOD')) {
                self.log.debug(mviID + ' is EDIPI');
                idList.push({
                    type: 'edipi',
                    value: idParts[0]
                });
            } else if (idParts[1] === 'PI' && (idParts[2] === 'USVHA' || (idParts[3] === 'USVHA' && idParts[2].length === 4))) {
                self.log.debug(mviID + ' is DFN');
                var siteHash;
                if (idParts[2] === 'USVHA') {
                    siteHash = self.getSitehash(idParts[3]);
                    if (!siteHash) {
                        self.log.warn('No site hash found for station number ' + idParts[3]);
                        siteHash = '9E7A'; //temporary until new RPC is available
                    }
                } else {
                    siteHash = idParts[2];
                }
                idList.push({
                    type: 'pid',
                    value: siteHash + ';' + idParts[0]
                });
            } else {
                self.log.warn('MviClient._makePatientIdentifiers() found unknown id type: ' + mviID);
                return cb(true);
            }
            return cb(true);
        }, function() {
            idList = _.filter(idList, function(id) {
                return !_.isUndefined(id.value);
            });
            if (idList.length > 0) {
                self.log.debug('MVI Returning: ' + util.inspect(idList));
                self.metrics.debug('Returning correspondingIds', {'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
                return callback(null, {
                    ids: idList
                });
            } else {
                self.metrics.debug('Returning correspondingIds', {'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
                return callback('no ids found for' + inspect(queryPatientIdentifier));
            }
        });
    } else {
        self.metrics.debug('Returning correspondingIds', {'subsystem':'MVI', 'action':'correspondingId','pid':queryPatientIdentifier.value, 'process':process, 'timer':'stop'});
        return callback('mvi-client._makePatientIdentifiers() No ids in list');
    }
};

MviClient.prototype.getStationNumber = function(siteHash) {
    var self = this;
    return self.rootConfig.vistaSites[siteHash].stationNumber;
};

MviClient.prototype.getSitehash = function(stationNumber) {
    var self = this;
    return _.findWhere(self.rootConfig.vistaSites, {
        'stationNumber': stationNumber
    });
};

module.exports = MviClient;