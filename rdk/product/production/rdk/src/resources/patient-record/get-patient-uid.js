'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;

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
        summary: 'Get patient uid',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.uid('patient data', true)
        ],
        responseMessages: []
    }
};

function getPatientUid(req, next, callback) {
    req.audit.logCategory = 'RETRIEVE';

    var uid = req.param('uid');
    var pid = req.param('pid');
    // /urn:va:\w+:\d+:\d+.*/
    if (nullchecker.isNullish(uid) || nullchecker.isNullish(pid)) {
        return next(); // require path
    }

    var options = _.extend({}, req.app.config.jdsServer, {
        method: 'GET',
        //path: '/vpr/' + '9E7A;3' + '/' + 'urn:va:problem:C877:3:747'  // good
        //path: '/vpr/' + '9E7A;3' + '/' + 'urn:va:problem:9E7A:253:783'  // bad key
        path: '/vpr/' + pid + '/' + uid
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };
    httpUtil.fetch(req.app.config, config, callback);
}

module.exports = getPatientUid;
module.exports.parameters = parameters;
module.exports.apiDocs = apiDocs;
