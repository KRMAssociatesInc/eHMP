'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var errors = require('../common/errors.js');
var querystring = require('querystring');
var composition = require('./composition');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        type: {
            required: false,
            description: 'all documents if not present. Discharge summary notes if equals to \'34745-0\'. For all others use \'34765-8\' '
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
        }
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        parameters: parameters,
        apiDocs: apiDocs,
        get: getComposition,
        permissions: [],
        permitResponseFormat: true,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'authorization']
        }
    }];
};

var apiDocs = {
    spec: {
        path: '/fhir/composition',
        nickname: 'fhir-composition',
        summary: 'Converts a vpr document into a composition FHIR resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.swagger.paramTypes.query('type', 'type', 'string', true),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};



function getComposition(req, res, next) {

    var pid = req.query['subject.identifier'];
    var type = req.param('type');
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    getCompositionData(req, pid, type, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {

            var outJSON = {};
            outJSON = composition.convertToFhir(inputJSON, req);

            res.status(200).send(outJSON);
        }
    });
}

function getCompositionData(req, pid, type, callback) {
    var config = req.app.config;
    var jdsResource, jdsPath;
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    if (type === undefined) {
        jdsResource = '/vpr/' + pid + '/index/document/';
    } else if ((nullchecker.isNotNullish(type) && type === '34745-0')) {
        jdsResource = '/vpr/' + pid + '/index/document/?filter=in(kind,%5B%22Discharge%20Summary%22,%22Discharge%20Summarization%20Note%22%5D)';
    } else if ((nullchecker.isNotNullish(type) && type === '34765-8')) {
        jdsResource = '/vpr/' + pid + '/index/document/?filter=not(in(kind,%5B%22Discharge%20Summary%22,%22Discharge%20Summarization%20Note%22%5D))';
    }
    if (jdsResource !== undefined && jdsResource.indexOf('?') > -1) {
        jdsPath = jdsResource + '&' + querystring.stringify(jdsQuery);
    } else {
        jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
    }
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

module.exports.getCompositionData = getCompositionData;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getComposition = getComposition;
