'use strict';

var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var fetchPatientUid = require('./getPatientUid');

module.exports.getResourceConfig = function () {
    return [{
        name: '',
        path: '',
        get: getPatientUid,
        parameters: fetchPatientUid.parameters,
        apiDocs: fetchPatientUid.apiDocs,
        interceptors: {
            synchronize: true
        },
        //outerceptors: ['asu'],
        healthcheck: {
            dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
        },
        permissions: []
    }];
};

function getPatientUid(req, res, next) {
    fetchPatientUid(req, next, function(err, data, jdsStatusCode) {
        if(!nullchecker.isNullish(err)) {
            res.send(500, '500');  // TODO respond with real error
            return;
        }

        res.set('Content-Type', 'application/json').status(jdsStatusCode).send(data);
    });
}
