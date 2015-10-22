'use strict';

var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');
var async = require('async');
var rdk = require('../../../core/rdk');
var jdsFilter = require('jds-filter');
var httpUtil = rdk.utils.http;
var nullchecker = rdk.utils.nullchecker;
var auditUtil = require('../../../utils/audit');


module.exports = getTrendDetail;
module.exports.description = {
    get: 'Get text search result detail where the items in a group are data points that should be graphed'
};
module.exports.parameters = {
    get: {
        pid: {
            required: true
        },
        uid: {
            required: true
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Get text search result detail where the items in a group are data points that should be graphed',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.uid('', true)
        ],
        responseMessages: []
    }
};

function getTrendDetail(req, res, next) {

    req.audit.patientId = req.query.pid;
    req.audit.logCategory = 'SEARCH';
    auditUtil.addAdditionalMessage(req, 'searchCriteria', util.format('pid=%s,uid=%s,', req.query.pid, req.query.uid));

    if (!_.every(['pid', 'uid'], _.has.bind(null, req.query))) {
        return next();
    }

    //var domain = req.query.domain;
    var pid = req.query.pid;
    var uid = req.query.uid;

    var detailDomains = {
        med: buildMedDetailPath,
        document: buildDocumentDetailPath,
        vital: buildVitalDetailPath,
        lab: buildLabDetailPath,
        problem: buildProblemDetailPath
    };

    var domainRegex = /^urn:(?:va:)?([^:]*)/;
    var domain = uid.match(domainRegex);
    if (!domain) {
        return res.status(400).rdkSend(new Error('Invalid uid'));
    }
    domain = domain[1];
    if (!_.has(detailDomains, domain)) {
        return res.status(400).rdkSend(new Error('Invalid uid'));
    }

    async.waterfall(
        [
            function(callback) {
                getUid(req, pid, uid, callback);
            },
            function(data, callback) {
                var jdsPath = detailDomains[domain](pid, data);
                var options = _.extend({}, req.app.config.jdsServer, {
                    method: 'GET',
                    path: jdsPath
                });
                var config = {
                    options: options,
                    protocol: 'http',
                    logger: req.logger
                };
                httpUtil.fetch(req.app.config, config, callback, function resultProcessor(statusCode, data) {
                    var response = {};
                    response.statusCode = statusCode;
                    response.data = JSON.parse(data);
                    return response;
                });
            }
        ],
        function(err, data) {
            if (err) {
                return res.status(500).rdkSend(new Error('Error'));
            }
            return res.status(data.statusCode).rdkSend(data.data);
        }
    );
}

function getUid(req, pid, uid, cb) {
    // TODO replace with subsystem after subsystems are ready

    var options = _.extend({}, req.app.config.jdsServer, {
        method: 'GET',
        path: '/vpr/' + pid + '/' + uid
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };

    var jdsStatusCode;
    httpUtil.fetch(req.app.config, config,
        function(err, data) {
            if (!nullchecker.isNullish(err)) {
                return cb(err);
            }
            try {
                data = JSON.parse(data);
                cb(null, data);
            } catch (e) {
                return cb(e);
            }
            //res.set('Content-Type', 'application/json').status(jdsStatusCode).rdkSend(data);
        },
        function resultProcessor(statusCode, data) {
            jdsStatusCode = statusCode;
            return data;
        }
    );
}

function buildMedDetailPath(pid, uidData) {
    // qualifiedName
    var uidItemData = uidData.data.items[0] || null;
    var jdsResource = '/vpr/' + pid + '/index/medication';
    var jdsFilterString = jdsFilter.build([
        ['eq', 'qualifiedName', uidItemData.qualifiedName]
    ]);
    var jdsQuery = {
        filter: jdsFilterString
    };
    jdsQuery = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQuery;
    return jdsPath;
}

function buildDocumentDetailPath(pid, uidData) {
    // localTitle
    var uidItemData = uidData.data.items[0] || null;
    var jdsResource = '/vpr/' + pid + '/index/document';
    var jdsFilterString = jdsFilter.build([
        ['eq', 'qualifiedName', uidItemData.qualifiedName]
    ]);
    var jdsQuery = {
        filter: jdsFilterString
    };
    jdsQuery = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQuery;
    return jdsPath;
}

function buildVitalDetailPath() {
    // qualifiedName
}

function buildLabDetailPath() {
    // qualifiedName
}

function buildProblemDetailPath() {
    // icdGroup
}
