'use strict';
var ra = require('../common/entities/radiology-objects.js'),
    errors = require('../common/errors'),
    //   helpers = require('../common/utils/helpers.js'),
    domains = require('../common/domain-map.js'),
    rdk = require('../../core/rdk'),
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
            operationalDataCheck: false,
            synchronize: false
        },
        parameters: parameters,
        permitResponseFormat: true
    }];
}

function getRadiologyReport(req, res, next) {
    fetchRadiologyReport(req, function(err, inputJSON) {
        if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err instanceof errors.FetchError) {
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {
            res.status(200).send({
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
            logger: req.logger,
            options: options
        };
    if (nullchecker.isNullish(pid)) {
        return next();
    }

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {

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
