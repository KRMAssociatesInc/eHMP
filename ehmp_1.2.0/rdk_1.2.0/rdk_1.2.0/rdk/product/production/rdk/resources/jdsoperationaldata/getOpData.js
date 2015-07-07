/**
 * Returns the list of valid values for the vital, laboratory, and medication types from JDS
 *
 * @return {JSON}      - an object that conatins the required list of values
 *
 **/

'use strict';
var _ = require('underscore');
var querystring = require('querystring');
var util = require('util');
var async = require('async');
var rdk = require('../../rdk/rdk');
var httpUtil = rdk.utils.http;

var apiDocs = {
    spec: {
        nickname: 'operational_data_type_~type~',
        description: 'Valid names of vital, laboratory, and medication',
        path: '/operational-data/type/{type}',
        summary: 'Get a list of valid names by type',
        notes: 'Returns a list of valid names of requested type',
        parameters: [
            rdk.docs.swagger.paramTypes.path('type', 'Select name of list to be fetched', 'string', ['vital', 'laboratory', 'medication']),
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: [{
            code: 200,
            message: 'Success'
        }, {
            code: 500,
            message: 'Invalid type. Please use vital, laboratory, or medication.'
        }]
    }
};

var parameters = {
    limit: {
        required: false,
        description: 'the maximum number of items to return from the server'
    }
};
var interceptors = {
    pep: false
};

function buildVitalsPath(req, callback) {

    var jdsResource = '/data/find/vitaltypes-list';
    var jdsQuery = {};
    var userSession = req.session.user || {};
    var limit = req.param('limit');
    var site = userSession.site || null;
    if (limit) {
        jdsQuery.limit = Number(limit);
    }
    if (site) {
        jdsQuery.filter = 'like("uid","%' + site + '%")';
    }

    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;

    return callback(null, jdsPath);
}

function buildLaboratoryPath(req, callback) {

    var jdsResource = '/data/find/orderable';
    var jdsQuery = {};
    var userSession = req.session.user || {};
    var limit = req.param('limit');
    var site = userSession.site || null;
    if (limit) {
        jdsQuery.limit = Number(limit);
    }
    if (site) {
        jdsQuery.filter = 'and(eq(linktype,LRT), like("uid","%' + site + '%"))';
    }

    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;

    return callback(null, jdsPath);
}

function buildMedicationPath(req, callback) {

    var jdsResource = '/data/find/orderable';
    var jdsQuery = {};
    var userSession = req.session.user || {};
    var limit = req.param('limit');
    var site = userSession.site || null;
    if (limit) {
        jdsQuery.limit = Number(limit);
    }
    if (site) {
        jdsQuery.filter = 'and(eq(linktype,PSP), like("uid","%' + site + '%"))';
    }

    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;

    return callback(null, jdsPath);
}

function getOpData(opType, req, res) {
    req.logger.warn('op %s resource GET called', opType);
    req.audit.logCategory = util.format('Operation Data Type - %s', opType.toUpperCase());

    var opPathBuilders = {
        vital: buildVitalsPath,
        laboratory: buildLaboratoryPath,
        medication: buildMedicationPath
    };
    async.waterfall(
        [
            opPathBuilders[opType].bind(null, req),
            getJdsResponse.bind(null, req)
        ],
        function(err, results) {
            if (err) {
                return res.status(rdk.httpstatus.internal_server_error).json(err);
            }
            return res.status(results.statusCode).send(results.data);
        }
    );
}

function getJdsResponse(req, path, callback) {
    var jdsServer = req.app.config.jdsServer;
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        path: path
    });
    var config = {
        options: options,
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger
    };
    httpUtil.fetch(config, callback, function resultProcessor(statusCode, data) {
        try {
            data = JSON.parse(data);
        } catch (e) {}
        var resultObj = {};
        resultObj.data = data;
        resultObj.statusCode = statusCode;
        return resultObj;
    });
}

module.exports = getOpData;
module.exports.interceptors = interceptors;
module.exports.parameters = parameters;
module.exports.apiDocs = apiDocs;
