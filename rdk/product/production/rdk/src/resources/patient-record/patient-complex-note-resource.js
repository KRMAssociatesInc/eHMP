'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var async = require('async');
var httpUtil = rdk.utils.http;
var fetchPatientUid = require('./get-patient-uid');
var url = require('url');

FetchError.prototype = Error.prototype;
NotFoundError.prototype = Error.prototype;

var description = {
    get: 'Get the DoD Complex Note for a given document for a patient'
};

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        uid: {
            required: true,
            description: 'must be a uid inside the data of this patient'
        }
    }
};

var apiDocs = {
    spec: {
        summary: 'Get the DoD complex note for a given document on a patient',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.uid('complex note', true)
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        get: getComplexNote,
        parameters: parameters,
        apiDocs: apiDocs,
        description: description,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        outerceptors: ['asu'],
        permissions: []
    }];
};

function getComplexNote(req, res, next) {

    async.waterfall([

        getDocumentContent.bind(null, req, next),

        getComplexNoteContent.bind(null, req)

    ], function(err, results) {
        if (err) {
            if (err.name === 'FetchError') {
                req.logger.error(err.message);
                res.status(rdk.httpstatus.internal_server_error).rdkSend('There was an error processing your request. The error has been logged.');
            } else if (err.name === 'NotFoundError') {
                res.status(rdk.httpstatus.not_found).rdkSend(err.error || err.message);
            } else {
                req.logger.error(err.message);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
            }
        } else {
            res.rdkSend({
                complexNote: results
            });
        }
    });
}

function getDocumentContent(req, next, callback) {
    fetchPatientUid(req, next, function(err, data, statusCode) {
        if (err) {
            return callback(err, data);
        }
        var obj = JSON.parse(data);
        if ('data' in obj) {
            return callback(null, obj);
        } else if ('error' in obj) {
            if (obj.error.code === 404) {
                return callback(new NotFoundError('Unable to retrieve document containing complex note - ' + obj.error.message, obj.error));
            }
            return callback(new Error('Unable to retrieve document containing complex note - ' + obj.error.message, obj.error));
        }
        return callback(new Error('Unable to retrieve document containing complex note', obj));
    });
}

function getComplexNoteContent(req, results, callback) {
    req.audit.logCategory = 'RETRIEVE';

    var pid = req.param('uid');

    var documentItems = results.data.items;
    if (documentItems.length > 0) {
        var complexNoteUri = documentItems[0].dodComplexNoteUri;

        if (complexNoteUri) {
            var complexNotePath = url.parse(complexNoteUri).path;
            var vxSyncServer = _.clone(req.app.config.vxSyncServer);
            var baseComplexNoteConfig = _.clone(req.app.config.vxSyncComplexNote.getComplexNote);
            var options = _.extend({}, baseComplexNoteConfig.options, {
                host: vxSyncServer.host,
                port: baseComplexNoteConfig.port,
                path: complexNotePath//,
            });
            var config = _.extend({}, baseComplexNoteConfig, {
                logger: req.logger,
                options: options
            });

            httpUtil.fetch(req.app.config, config, function(error, result, statusCode) {
                // TODO do other error codes (e.g. 500) result in an error object or do we need to look more closely at the status code?
                if (statusCode === 404) {
                    return callback(new NotFoundError('The Complex Note was not found'));
                } else if (error) {
                    return callback(new FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
                } else {
                    return callback(null, result);
                }
            });
        } else {
            callback(new NotFoundError('There is no Complex Note for this document')); //TODO don't throw an error here, just return empty results
        }
    } else {
        callback(new Error('The document was not found'));
    }
}

function FetchError(message, error) {
    this.name = 'FetchError';
    this.error = error;
    this.message = message;
}

function NotFoundError(message, error) {
    this.name = 'NotFoundError';
    this.error = error;
    this.message = message;
}

exports.getResourceConfig = getResourceConfig;
