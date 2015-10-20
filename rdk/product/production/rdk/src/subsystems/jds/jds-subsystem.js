'use strict';

var _ = require('lodash');
var rdk = require('../../core/rdk');
var jdsDomains = require('./jds-domains');
var querystring = require('querystring');
var patientRecordAnnotator = require('./patient-record-annotator');
var http = rdk.utils.http;

module.exports.getSubsystemConfig = getSubsystemConfig;
module.exports.getPatientDomainData = getPatientDomainData;

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'jds',
            interval: 100000,
            check: function(callback) {
                var jdsOptions = _.extend({}, app.config.jdsServer, {
                    path: '/ping',
                    method: 'GET'
                });
                var jdsConfig = {
                    timeoutMillis: 5000,
                    protocol: 'http',
                    options: jdsOptions
                };

                http.fetch(app.config, jdsConfig, function(err) {
                    if(err) {
                        return callback(false);
                    }
                    callback(true);
                });
            }
        }
    };
}

/**
 * @param {HttpRequest} req
 * @param {String|Number} pid The pid of the pre-synchronized patient
 * @param {String} domain
 * @param {Object} query querystring.stringify object
 * @param {Object} vlerQuery
 * @param {Function} callback receives (error, response, statusCode)
 *     where error is null if there was no error performing the fetch
 *     where response is the response body object
 *     where statusCode is the fetch status code if available
 */
function getPatientDomainData(req, pid, domain, query, vlerQuery, callback) {
    var name;
    var index;
    if(jdsDomains.hasName(domain)) {
        name = domain;
        index = jdsDomains.indexForName(name);
    } else if(jdsDomains.hasIndex(domain)) {
        index = domain;
        name = jdsDomains.nameForIndex(index);
    } else {
        return callback(new Error('Bad domain'));
    }

    var jdsResource;
    if(index === 'patient') {
        jdsResource = '/vpr/' + pid + '/find/patient';
    } else {
        jdsResource = '/vpr/' + pid + '/index/' + index;
    }
    query = query || {};

    var vlerCallType = vlerQuery.vlerCallType;
    var vlerUid = vlerQuery.vlerUid;
    var jdsPath = jdsResource + '?' + querystring.stringify(query);
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    return rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result, statusCode) {
        if(error) {
            req.logger.error(error);
            return callback(error, null, statusCode);
        }
        var jdsResponse;
        try {
            jdsResponse = JSON.parse(result);
        } catch(error) {
            req.logger.error(error);
            return callback(error, null, statusCode);
        }
        if(_.has(jdsResponse, 'error')) {
            return callback(new Error(jdsResponse.error), jdsResponse, statusCode);
        }
        if(_.has(jdsResponse, 'data')) {
            if(name === 'vlerdocument') {
                return transformVler(req.logger, vlerCallType, vlerUid, name, jdsResponse, statusCode, callback);
            } else if(name === 'patient') {
                return transformCwadf(req, pid, jdsResponse, callback);
            } else {
                return callback(null, transformDomainData(name, jdsResponse), statusCode);
            }
        }
        return callback(new Error('Missing data in JDS response. Is the patient synced?'), jdsResponse, statusCode);
    });
}

function transformCwadf(req, pid, domainData, callback) {
    var options = _.extend({}, req.app.config.jdsServer, {
        path: '/vpr/' + pid + '/index/cwad',
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result, statusCode) {
        if(error) {
            httpConfig.logger.error(error);
            return callback(error, null, statusCode);
        }
        var cwadData;
        try {
            cwadData = JSON.parse(result);
        } catch(e) {
            httpConfig.logger.error(e);
            return callback(e, null, statusCode);
        }

        var cwadf = {};

        _.each(cwadData.data.items, function(cwadSiteObj) {
            var kind = cwadSiteObj.kind;
            cwadf.C = cwadf.C || kind === 'Crisis Note';
            cwadf.W = cwadf.W || kind === 'Clinical Warning';
            cwadf.A = cwadf.A || kind === 'Allergy/Adverse Reaction';
            cwadf.D = cwadf.D || kind === 'Advance Directive';
        });
        var foundPatientRecordFlag = _.some(domainData.data.items, function(patientRecordSiteObj) {
            return _.has(patientRecordSiteObj, 'patientRecordFlag');
        });
        cwadf.F = foundPatientRecordFlag;
        cwadf = _.keys(_.pick(cwadf, _.identity)).join('');

        _.each(domainData.data.items, function(patientRecordSiteObj) {
            patientRecordSiteObj.cwadf = cwadf;
        });

        return callback(null, transformDomainData('patient', domainData), statusCode);
    });
}

function transformVler(logger, vlerCallType, vlerUid, name, jdsResponse, statusCode, callback) {
    var vlerData = jdsResponse;
    if (vlerCallType) {
        vlerData =  filterVlerData(vlerCallType, vlerUid, name, jdsResponse);
    }
    if (vlerData.data.totalItems < 1) {
        return callback(null, vlerData, statusCode);
    }
    if (vlerData.data.totalItems > 0) {
        patientRecordAnnotator.decompressFullHtml(vlerData, function(err, decompressedData) {
            if (err) {
                logger.error(err);
                return callback(err, null, statusCode);
            }
            return callback(null, vlerData, statusCode);
        });
    }
}

function transformDomainData(domainName, domainData) {
    //var sites = getSyncedSites();  // TODO implement?
    if(domainName === 'vital') {
        patientRecordAnnotator.addCalculatedBMI(domainData);
        patientRecordAnnotator.addReferenceRanges(domainData);
    }
    if(domainName === 'med') {
        domainData = patientRecordAnnotator.setExpirationLabel(domainData);
        domainData = patientRecordAnnotator.setTimeSince(domainData);
        domainData = patientRecordAnnotator.addNormalizedName(domainData);
    }
    if(domainName === 'problem') {
        domainData = patientRecordAnnotator.setStandardizedDescription(domainData);
    }
    return domainData;
}

function filterVlerData(vlerCallType, vlerUid, name, domainData) {
    var vlerData = patientRecordAnnotator.filterVlerData(vlerCallType, vlerUid, name, domainData);
    return vlerData;
}
