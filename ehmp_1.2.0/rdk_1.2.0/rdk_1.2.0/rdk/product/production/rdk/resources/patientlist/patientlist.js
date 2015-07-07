/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var cfg = require('./config');
var request = require('request');
var patientlistStore = cfg.PatientlistListener;

// ////////////////////////////////////////////////////////////
// Patient List
// ////////////////////////////////////////////////////////////

/**
 * @api {get} /resource/patientlist/list?id Request Patientlist
 * 
 * @apiName getPatientlist
 * @apiGroup Patient List
 * 
 * @apiParam {Number} [id] patientlist id 24 digit HEX number
 * @apiParam {String} [name] patientlist name
 * 
 * @apiSuccess (200) {json[]} payload A Patientlist or Array of patientlists
 * @apiError (404) {String} payload Not found
 * 
 */
// GET from CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.getPatientlist = function(req, res) {
    req.logger.debug('Patientlist GET called');

    var query = '';
    if (req.query && req.query.id) {
        query += '?id=' + req.query.id;
    }
    else if (req.query && req.query.name) {
        query += '?name=' + req.query.name;
    }
    query = (!query) ? '?' : query + '&';
    query += 'username=' + req.session.user.username;

    var url = 'http://' + patientlistStore.host + ':' + patientlistStore.port + '/patientlist/list' + query;

    request.get({
        url : url,
        timeout : 50000
    }, function(error, response, body) {
        // NOTE: If we use the response object above for anything - it's
        // massive. Look at it in detail and make sure you actually need it.
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};

/**
 * @api {post} /resource/patientlist/list Create Patientlist
 * 
 * @apiName postPatientlist
 * @apiGroup Patient List
 * 
 * @apiHeader {json} request.body patientlist
 * 
 * @apiSuccess (201) {json} response.patientlist Patientlist JSON document
 * @apiSuccess (400) {json} error Invalid call description
 * 
 */
// Post to CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.postPatientlist = function(req, res) {
    req.logger.debug('Patientlist POST called');

    var content = req.body;
    var url = 'http://' + patientlistStore.host + ':' + patientlistStore.port + '/patientlist/list';

    content.user = req.session.user;
    
    request.post({
        url : url,
        timeout : 50000,
        json : content
    }, function(error, response, body) {
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};

/**
 * @api {delete} /resource/patientlist?id Delete Patientlist
 * 
 * @apiName deletePatientlist
 * @apiGroup Patient List
 * 
 * @apiParam {Number} id - 24 digit HEX number doc id
 * 
 * @apiSuccess (200) {json} payload delete count
 * @apiError (404) {String} payload Not found
 * 
 */
// Delete to CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.deletePatientlist = function(req, res) {
    req.logger.debug('Patientlist DELETE called');

    var query = '';
    if (req.query && req.query.id) {
        query = req.query.id;
    }
    var url = 'http://' + patientlistStore.host + ':' + patientlistStore.port + '/patientlist/list/' + query;

    request.del({
        timeout : 50000,
        url : url
    }, function(error, response, body) {
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};

/**
 * @api {post} /resource/patientlist/patientlist/patients?id&pid add patient
 * 
 * @apiName addPatient
 * @apiGroup Patient List
 * 
 * @apiParam {Number} id - 24 digit HEX number doc id
 * @apiParam {String} pid - patient identifier
 * 
 * @apiSuccess (200) {json} payload update message
 * @apiError (404) {String} payload Not found
 * 
 */
// Post pid to CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.addPatient = function(req, res) {
    req.logger.debug('Patientlist POST called');

    var query = '';
    var id = '/';
    var pid = '/';
    if (req.query && req.query.id) {
        id += req.query.id;
    }
    if (req.query && req.query.pid) {
        pid += req.query.pid;
    }
    query = id + pid;

    var url = 'http://' + patientlistStore.host + ':' + patientlistStore.port + '/patientlist/list/patients' + query;

    request.post({
        url : url,
        timeout : 50000
    }, function(error, response, body) {
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};

/**
 * @api {delete} /resource/patientlist/patientlist/patients?id=123&pid=abc Remove Patient
 * 
 * @apiName removePatient
 * @apiGroup Patient List
 * 
 * @apiParam {Number} id - 24 digit HEX number doc id
 * @apiParam {String} pid - patient identifier
 * 
 * @apiSuccess (200) {json} payload update message
 * @apiError (404) {String} payload Not found
 * 
 */
// Delete pid to CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.removePatient = function(req, res) {
    req.logger.debug('Patientlist DELETE called');

    var query = '';
    var id = '/';
    var pid = '/';
    if (req.query && req.query.id) {
        id += req.query.id;
    }
    if (req.query && req.query.pid) {
        pid += req.query.pid;
    }
    query = id + pid;

    var url = 'http://' + patientlistStore.host + ':' + patientlistStore.port + '/patientlist/list/patients' + query;

    request.del({
        timeout : 50000,
        url : url
    }, function(error, response, body) {
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};
