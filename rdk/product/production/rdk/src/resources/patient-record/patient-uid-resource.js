'use strict';

var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var fetchPatientUid = require('./get-patient-uid');

module.exports.getResourceConfig = function () {
    return [{
        name: '',
        path: '',
        get: getPatientUid,
        parameters: fetchPatientUid.parameters,
        apiDocs: fetchPatientUid.apiDocs,
        outerceptors: ['asu'],
        healthcheck: {
            dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
        },
        permissions: []
    }];
};

function getPatientUid(req, res, next) {
    fetchPatientUid(req, next, function(err, data, jdsStatusCode) {
        if(!nullchecker.isNullish(err)) {
            res.status(500).rdkSend('500');  // TODO respond with real error
            return;
        }

        res.set('Content-Type', 'application/json').status(jdsStatusCode).rdkSend(data);
    });
}
