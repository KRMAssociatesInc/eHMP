'use strict';

var _ = require('lodash');
var rdk = require('../../rdk/rdk');
var jdsDomains = require('./jdsDomains');
var querystring = require('querystring');
var patientRecordUtil = require('./patientRecordUtil');
var http = rdk.utils.http;
var auditUtil = require('../../utils/audit/auditUtil');
var util = require('util');

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

                http.fetch(jdsConfig, function(err) {
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
 * @param {Object} logger Bunyan logger object
 * @param {Object} jdsServer rdk.utils.http.fetch config object
 * @param {String|Number} pid The pid of the pre-synchronized patient
 * @param {String} domain
 * @param {Object} query querystring.stringify object
 * @param {Function} callback receives (error, response, statusCode)
 *     where error is null if there was no error performing the fetch
 *     where response is the response body object
 *     where statusCode is the fetch status code if available
 */
function getPatientDomainData(logger, jdsServer, pid, domain, query, vlerQuery, callback) {
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
    var vler_uid = vlerQuery.vler_uid;
    var jdsPath = jdsResource + '?' + querystring.stringify(query);
    var options = _.extend({}, jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: logger,
        options: options
    };

    return rdk.utils.http.fetch(httpConfig, function(error, result, statusCode) {
        if(error) {
            logger.error(error);
            return callback(error, null, statusCode);
        }
        var jdsResponse;
        try {
            jdsResponse = JSON.parse(result);
        } catch(error) {
            logger.error(error);
            return callback(error, null, statusCode);
        }
        if(_.has(jdsResponse, 'error')) {
            return callback(new Error(jdsResponse.error), jdsResponse, statusCode);
        }
        if(_.has(jdsResponse, 'data')) {
            if(vlerCallType) {
                return callback(null, filterVlerData(vlerCallType, vler_uid, name, jdsResponse), statusCode);
            } else if(name === 'patient') {
                return transformCwadf(logger, jdsServer, pid, jdsResponse, callback);
            } else {
                return callback(null, transformDomainData(name, jdsResponse), statusCode);
            }
        }
        return callback(new Error('Missing data in JDS response. Is the patient synced?'), jdsResponse, statusCode);
    });
}

function transformCwadf(logger, jdsServer, pid, domainData, callback) {
    var options = _.extend({}, jdsServer, {
        path: '/vpr/' + pid + '/index/cwad',
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: logger,
        options: options
    };

    rdk.utils.http.fetch(httpConfig, function(error, result, statusCode) {
        if(error) {
            logger.error(error);
            return callback(error, null, statusCode);
        }
        var cwadData;
        try {
            cwadData = JSON.parse(result);
        } catch(e) {
            logger.error(e);
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

function transformDomainData(domainName, domainData) {
    //var sites = getSyncedSites();  // TODO implement?
    if(domainName === 'vital') {
        patientRecordUtil.addCalculatedBMI(domainData);
        patientRecordUtil.addReferenceRanges(domainData);
    }
    if(domainName === 'med') {
        domainData = patientRecordUtil.setExpirationLabel(domainData);
        domainData = patientRecordUtil.setTimeSince(domainData);
        domainData = patientRecordUtil.addNormalizedName(domainData);
    }
    if(domainName === 'problem') {
        domainData = patientRecordUtil.setStandardizedDescription(domainData);
    }
    return domainData;
}

function filterVlerData(vlerCallType, vler_uid, name, daminData) {
    var vlerData = patientRecordUtil.filterVlerData(vlerCallType, vler_uid, name, daminData);

    return vlerData;

}
