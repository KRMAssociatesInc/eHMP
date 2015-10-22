'use strict';
var _ = require('underscore');
var querystring = require('querystring');
var util = require('util');
var async = require('async');

var rdk = require('../../core/rdk');
var httpUtil = rdk.utils.http;
var jdsFilter = require('jds-filter');

var apiDocs = {
    admissions: {
        spec: {
            summary: '',
            notes: '',
            parameters: [
                rdk.docs.commonParams.pid,
                rdk.docs.commonParams.jds.order
            ],
            responseMessages: []
        }
    },
    appointments: {
        spec: {
            summary: '',
            notes: '',
            parameters: [
                rdk.docs.commonParams.pid,
                rdk.docs.commonParams.jds.order
            ],
            responseMessages: []
        }
    },
    providers: {
        spec: {
            summary: '',
            notes: '',
            parameters: [
                rdk.docs.swagger.paramTypes.query('facility.code', 'facility code', 'string', true),
                rdk.docs.swagger.paramTypes.query('facility.name', 'facility name', 'string', false),
                rdk.docs.commonParams.jds.order
            ],
            responseMessages: []
        }
    },
    locations: {
        spec: {
            summary: '',
            notes: '',
            parameters: [
                rdk.docs.swagger.paramTypes.query('facility.code', 'facility code', 'string', true),
                rdk.docs.swagger.paramTypes.query('provider.name', 'provider name', 'string', false),
                rdk.docs.commonParams.jds.limit,
                rdk.docs.commonParams.jds.order
            ],
            responseMessages: []
        }
    }
};

var parameters = {};
parameters.admissions = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};
parameters.appointments = parameters.admissions;
parameters.locations = {
    get: {
        'facility.code': {
            required: false,
            description: 'facility code'
        },
        'facility.name': {
            required: false,
            description: 'facility name'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};
parameters.providers = {
    get: {
        'facility.code': {
            required: true,
            description: 'facility id'
        },
        'provider.name': {
            required: false,
            description: 'provider name'
        },
        limit: {
            required: false,
            description: 'the number of results to return per page'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};
var interceptors = {};
interceptors.providers = {pep: false, synchronize: false};
interceptors.locations = {pep: false, synchronize: false};
interceptors.appointments = {synchronize: false};
interceptors.admissions = {synchronize: false};

var permissions = {};
permissions.appointments = ['add-patient-visit', 'edit-patient-visit', 'remove-patient-visit'];
permissions.admissions = ['add-patient-visit', 'edit-patient-visit', 'remove-patient-visit'];

function buildAdmissionsPath(req, callback) {
    var patientId = req.param('pid');
    var order = req.query.order;

    if(!patientId) {
        return callback(new ParameterError('Missing pid'));
    }

    var jdsResource = util.format('/vpr/%s/find/visit', patientId);
    var jdsQuery = {};
    jdsQuery.filter = jdsFilter.build([
        ['eq', 'kind', '"Admission"']
    ]);
    if(order) {
        jdsQuery.order = order;
    }
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;
    return callback(null, jdsPath);
}

function buildProvidersPath(req, callback) {
    var fcode = req.param('facility.code');
    var pname = req.param('provider.name') || '';
    var limit = req.param('limit');
    var order = req.query.order;

    if(!fcode) {
        return callback(new ParameterError('Missing facility.code'));
    }

    var jdsResource = '/data/find/user';
    var jdsQuery = {};
    jdsQuery.filter = jdsFilter.build([
        ['like', 'uid', '"%' + fcode + '%"'],
        ['eq', '"vistaKeys[].name"', 'PROVIDER'],
        ['ilike', 'name', '"%' + pname + '%"']
    ]);
    if(limit) {
        jdsQuery.limit = limit;
    }
    if(order) {
        jdsQuery.order = order;
    }
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;
    return callback(null, jdsPath);
}

function buildLocationsPath(req, callback) {
    var fcode = req.param('facility.code');
    var fname = req.param('facility.name');
    var order = req.query.order;

    var jdsResource = '/data/find/location';
    var jdsQuery = {};
    var filter = [];
    filter.push(['ne', 'inactive', 'true']);
    if(fcode) {
        filter.push(['eq', 'facilityCode', fcode]);
    }
    if(fname) {
        filter.push(['like', 'name', '%' + fname + '%']);
    }
    jdsQuery.filter = jdsFilter.build(filter);
    if(order) {
        jdsQuery.order = order;
    }
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;
    return callback(null, jdsPath);
}

function buildAppointmentsPath(req, callback) {
    var pid = req.param('pid');
    var order = req.query.order;

    if(!pid) {
        return callback(new ParameterError('Missing pid'));
    }

    var jdsResource = util.format('/vpr/%s/find/appointment', pid);
    var jdsQuery = {};
    if(order) {
        jdsQuery.order = order;
    }
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;
    return callback(null, jdsPath);
}

function getVisits(visitType, req, res, next) {
    req.logger.warn('visit %s resource GET called', visitType);
    req.audit.logCategory = util.format('VISIT - %s', visitType.toUpperCase());

    var visitPathBuilders = {
        admissions: buildAdmissionsPath,
        appointments: buildAppointmentsPath,
        locations: buildLocationsPath,
        providers: buildProvidersPath
    };
    async.waterfall(
        [
            visitPathBuilders[visitType].bind(null, req),
            getJdsVisitResponse.bind(null, req)
        ],
        function(err, results) {
            if(err instanceof ParameterError) {
                return next();
            }
            if(err) {
                return res.status(500).rdkSend(err.message);
            }
            return res.status(results.statusCode).rdkSend(results.data);
        }
    );
}

function getJdsVisitResponse(req, path, callback) {
    var jdsServer = req.app.config.jdsServer;
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        path: path
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };
    httpUtil.fetch(req.app.config, config, callback, function resultProcessor(statusCode, data) {
        try {
            data = JSON.parse(data);
        } catch(e) {
            // do nothing
        }
        var resultObj = {};
        resultObj.data = data;
        resultObj.statusCode = statusCode;
        return resultObj;
    });
}

function ParameterError(message) {
    this.message = message;
}
ParameterError.prototype = Error.prototype;


module.exports = getVisits;
module.exports.parameters = parameters;
module.exports.interceptors = interceptors;
module.exports.permissions = permissions;
module.exports.apiDocs = apiDocs;
