/*jslint node: true */
'use strict';
var ra = require('../common/entities/radiologyObjects.js'),
    errors = require('../common/errors'),
    //   helpers = require('../common/utils/helpers.js'),
    domains = require('../common/domainmap.js'),
    rdk = require('../../rdk/rdk'),
    _ = rdk.utils.underscore,
    nullchecker = rdk.utils.nullchecker,
    parameters = {
        get: {
            'subject.identifier': {
                required: true,
                description: 'patient id'
            }
        }
    };

function getResourceConfig() {
    return [{
        name: 'radiologyreport',
        path: '',
        get: getRadiologyReport,
        interceptors: {
            audit: false,
            metrics: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        },
        parameters: parameters
    }];
}

function getRadiologyReport(req, res, next) {
    fetchRadiologyReport(req, function(err, inputJSON) {
        if (err instanceof errors.NotFoundError) {
            res.send(rdk.httpstatus.not_found, err.error);
        } else if (err instanceof errors.FetchError) {
            res.send(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
        } else if (err) {
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {
            res.send(200, {
                response: processJSON(inputJSON, req)
            });
        }
    }, next);
}

function processJSON(inputJSON, req) {
    var outJSON = [],
        items = inputJSON.data.items;
    for (var i = 0, l = items.length; i < l; i++) {
        //add meta to item
        items[i].fhirMeta = {
            _pid: req._pid,
            _originalUrl: req.originalUrl,
            _host: req.headers.host,
            _protocol: req.protocol
        };
        outJSON.push(ra.radiologyFactory('radiologyReportItem', items[i]));
    }
    return outJSON;
}

function fetchRadiologyReport(req, callback, next) {
    req._pid = req.param('subject') || req.param('subject.identifier') || req.param('pid');
    var pid = req._pid,
        config = req.app.config,
        jdsResource = '/vpr/' + pid + '/index/' + domains.jds('rad'),
        options = _.extend({}, config.jdsServer, {
            path: jdsResource,
            method: 'GET'
        }),
        httpConfig = {
            protocol: 'http',
            timeoutMillis: 120000,
            logger: req.logger,
            options: options
        };
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    rdk.utils.http.fetch(httpConfig, function(error, result) {

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
module.exports.getResourceConfig = getResourceConfig;
module.exports.getRadiologyReport = getRadiologyReport;
module.exports.convertToFhir = processJSON;
