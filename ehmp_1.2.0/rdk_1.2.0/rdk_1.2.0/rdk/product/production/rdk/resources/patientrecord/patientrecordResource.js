/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var _ = rdk.utils.underscore;
var jdsFilter = rdk.utils.jdsFilter;
var jds = rdk.utils.jds;
var nullchecker = rdk.utils.nullchecker;

var description = {
    get: 'Get record data of one domain for one patient'
};

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        uid: {
            required: false,
            description: 'must be a uid inside the data of this patient'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        },
        filter: {
            required: false,
            regex: /eq("[^"]*","[^"]*")/,
            description: 'see the wiki for full documentation: https://wiki.vistacore.us/display/VACORE/JDS+Parameters+and+Filters'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        },
        callType: {
            required: false,
            description: 'the type of vlerdocument call (coversheet or modal)'
        },
        vler_uid: {
            required: false,
            description: 'VLER uid to filter only one item for modal)'
        }
    }
};

var apiDocs = {
    spec: {
        nickname: 'patient_record_~domain~',
        path: '/patient/record/domain/{domain}',
        summary: 'Get record data of one domain for a patient',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query('pid', 'patient id', 'string', true),
            rdk.docs.swagger.paramTypes.path('domain', 'domain', 'string', _.sortBy(jds.Domains.names, function(domain) { return domain; }))
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return _.map(jds.Domains.domains, function(domain) {
        return {
            name: domain.name,
            index: domain.index,
            path: '/domain/' + domain.name,
            interceptors: {
                synchronize: true,
                jdsFilter: true
            },
            get: getDomain.bind(null, domain.index, domain.name),
            parameters: parameters,
            apiDocs: apiDocs,
            description: description,
            healthcheck: {
                dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
            },
            permissions: []
        };
    });
};

function getDomain(index, name, req, res, next) {

    var config = req.app.config;

    req.logger.debug('getDomain(%s)', index);
    var pid = req.param('pid');
    var uid = req.param('uid');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var filter = req.interceptorResults.jdsFilter.filter || [];
    var order = req.query.order;
    var vlerCallType = req.param('callType');
    var vler_uid = req.param('vler_uid');

    req.audit.patientId = pid;
    req.audit.dataDomain = index;
    req.audit.logCategory = 'RETRIEVE';

    if(nullchecker.isNullish(pid)) {
        return next();
    }

    var jdsQuery = {
        start: start
    };
    if(limit) {
        jdsQuery.limit = limit;
    }
    if(order) {
        jdsQuery.order = order;
    }
    if(uid) {
        filter.push(['like', 'uid', uid]);
    }
    var filterString = jdsFilter.build(filter);
    if(filterString) {
        jdsQuery.filter = filterString;
    }

    var vlerQuery = {
        vlerCallType : vlerCallType,
        vler_uid : vler_uid
    };

    jds.getPatientDomainData(
        req.logger, config.jdsServer, pid, index, jdsQuery, vlerQuery,
        function(error, response, statusCode) {
            if(error) {
                return res.status(statusCode).send(error);
            }
            return res.status(statusCode).send(response);
        }
    );
}

module.exports.getResourceConfig = getResourceConfig;
