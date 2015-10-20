'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var jdsFilter = require('jds-filter');
var jds = rdk.utils.jds;
var nullchecker = rdk.utils.nullchecker;
var asu = require('../../subsystems/asu/asu-process');
var async = require('async');
var immunizationDupes = require('./patient-record-immunization-dupes');
var querystring = require('querystring');

var apiDocs = {
    spec: {
        nickname: 'patient-record-{domain}',
        path: '/patient/record/domain/{domain}',
        summary: 'Get record data of one domain for a patient',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.path('domain', 'domain', 'string', _.sortBy(jds.Domains.names, function (domain) {
                return domain;
            })),
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.uid('', false),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.filter,
            rdk.docs.commonParams.jds.order,
            rdk.docs.swagger.paramTypes.query('callType', 'the type of vlerdocument call (coversheet or modal)', 'string', false),
            rdk.docs.swagger.paramTypes.query('vler_uid', 'VLER uid to filter only one item for modal', 'string', false)
        ],
        responseMessages: []
    }
};

var getResourceConfig = function () {
    return _.map(jds.Domains.domains, function (domain) {
        return {
            name: domain.name,
            index: domain.index,
            path: '/domain/' + domain.name,
            interceptors: {
                jdsFilter: true
            },
            get: getDomain.bind(null, domain.index, domain.name),
            parameters: {
                get: {
                    pid: {required: true, description: 'patient id'},
                    uid: {required: false, description: 'must be a uid inside the data of this patient'},
                    start: {required: false, regex: /\d+/, description: 'start showing results from this 0-based index'},
                    limit: {required: false, regex: /\d+/, description: 'show this many results'},
                    filter: {required: false, regex: /eq("[^"]*","[^"]*")/, description: 'see the wiki for full documentation: https://wiki.vistacore.us/display/VACORE/JDS+Parameters+and+Filters'},
                    order: {required: false, regex: /\w+ (asc|desc)/, description: 'Field to sort by and order'},
                    callType: {required: false, description: 'the type of vlerdocument call (coversheet or modal)'},
                    vler_uid: {required: false, description: 'VLER uid to filter only one item for modal)'}
                }
            },
            apiDocs: apiDocs,
            description: {get: 'Get record data of one domain for one patient'},
            healthcheck: {
                dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
            },
            permissions: []
        };
    });
};

function JdsQuery(start, limit, order, uid, filter) {
    this.start = start || 0;
    if (limit) {
        this.limit = limit;
    }
    if (order) {
        this.order = order;
    }

    filter = filter || [];
    if (uid) {
        filter.push(['like', 'uid', uid]);
    }
    var filterString = jdsFilter.build(filter);
    if (filterString) {
        this.filter = filterString;
    }
}
JdsQuery.prototype.toString = function() {
    return querystring.stringify(this);
};

function noData(details) {
    return nullchecker.isNullish(details) || nullchecker.isNullish(details.data) ||
        nullchecker.isNullish(details.data.items) || !details.data.items.length;
}

function filterDocuments(req, details, callback) {
    var logger = req.logger;

    var filterDocByAsuPermission = function (item, doneCallback) {
        if (nullchecker.isNullish(item.documentDefUid)) {
            logger.debug('Item NOT evaluated by ASU: item.localTitle %j ', item.localTitle);
            return doneCallback(true);
        }

        logger.debug('Item ready to be sent for ASU evaluation:  item local title : %j ', item.localTitle);

        asu.getAsuPermission(req, {data: {items: [item]}}, function (asuError, asuResult) {
            if (!nullchecker.isNullish(asuError) || _.isNull(asuResult)) {
                req.logger.debug('Failed to check ASU: ' + asuError);
            }
            logger.debug('ASU result: %j for item %j ', asuResult, item.localTitle);
            return doneCallback(!nullchecker.isNullish(asuResult) && asuResult === 'true');
        });
    };

    async.filter(details.data.items, filterDocByAsuPermission, function (results) {
        logger.debug('Asu response at the end: %j', results);
        callback(null, results);
    });
}

function removeDuplicates(index, req, response) {
    if (index === 'immunization') {
        return immunizationDupes.removeDuplicateImmunizations(req.app.config.vistaSites, response.data.items);
    }
    return response;
}

function getDomain(index, name, req, res, next) {
    req.logger.debug('getDomain(%s)', index);

    var pid = req.param('pid');

    req.audit.patientId = pid;
    req.audit.dataDomain = index;
    req.audit.logCategory = 'RETRIEVE';

    if (nullchecker.isNullish(pid)) {
        return next();
    }

    var jdsQuery = new JdsQuery(req.param('start'), req.param('limit'), req.query.order, req.param('uid'),
        req.interceptorResults.jdsFilter.filter);

    var vlerQuery = {
        vlerCallType: req.param('callType'),
        vlerUid: req.param('vler_uid')
    };

    jds.getPatientDomainData(req, pid, index, jdsQuery, vlerQuery, function (error, response, statusCode) {
        statusCode = statusCode || 500;
        if (error) {
            return res.status(statusCode).rdkSend(error);
        }
        if (noData(response)) {
            return res.status(statusCode).rdkSend(response);
        }
        if (name === 'document-view') {
            return filterDocuments(req, response, function (err, results) {
                if (err) {
                    return res.status(statusCode).rdkSend(err);
                }
                return res.status(statusCode).rdkSend(results);
            });
        }

        response = removeDuplicates(index, req, response);
        return res.status(statusCode).rdkSend(response);

    });
}

module.exports.getResourceConfig = getResourceConfig;

//used for unit testing
module.exports._JdsQuery = JdsQuery;
module.exports._noData = noData;
module.exports._filterDocuments = filterDocuments;
module.exports._getDomain = getDomain;
