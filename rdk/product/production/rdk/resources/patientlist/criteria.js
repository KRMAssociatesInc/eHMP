/*jslint node: true */
'use strict';
    
var rdk = require('../../rdk/rdk');
var cfg = require('./config');
var request = require('request');
var criteriaStore = cfg.CriteriaListener;

/**
 * @api {get} /resource/patientlist/criteria?id Request Criteria
 * 
 * @apiName getCriteria
 * @apiGroup Patient Criteria
 * 
 * @apiParam {String} [id]  criteria id (has precedence over name)
 * @apiParam {String} [name]  criteria name
 * @apiParam {String}  - No parameters returns all criteria
 * 
 * @apiSuccess (200) {json[]} payload A Criteria or Array of criteria
 * @apiError (404) {json} payload The id or name was not found
 * 
 */
// GET from CDSInvocation MongoDB app /cds-data/criteria.js
module.exports.getCriteria = function(req, res) {
    req.logger.debug('Criteria GET called');

    var query = '';
    if (req.query && req.query.id) {
        query += '?id=' + req.query.id;
    }
    else if (req.query && req.query.name) {
        query += '?name=' + req.query.name;
    }
    query = (!query) ? '?' : query + '&';
    query += 'username=' + req.session.user.username;

    var url = 'http://' + criteriaStore.host + ':' + criteriaStore.port + '/patientlist/criteria' + query;

    request.get({
        url : url,
        timeout : 50000
    }, function(error, response, body) {
        // NOTE: If we use the response object above for anything - it's
        // massive. Look at it in detail and make sure you actually need it.
        if (error) {
            res.status(rdk.httpstatus.internal_server_error).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};

/**
 * @api {post} /resource/patientlist/criteria Create Criteria
 * 
 * @apiName postCriteria
 * @apiGroup Patient Criteria
 * 
 * @apiHeader {json} request.body Criteria
 * 
 * @apiSuccess (201) {json} payload Criteria JSON document
 * @apiError (400) {json} error Missing required field(s)
 * 
 */
// Post to CDSInvocation MongoDB app /cds-data/criteria.js
module.exports.postCriteria = function(req, res) {
    req.logger.debug('Criteria POST called');

    var content = req.body;

    var url = 'http://' + criteriaStore.host + ':' + criteriaStore.port + '/patientlist/criteria';

    request.post({
        url : url,
        timeout : 50000,
        json : content
    }, function(error, response, body) {
        if (error) {
            res.status(rdk.httpstatus.internal_server_error).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};

/**
 * @api {delete} /resource/patientlist/criteria Delete Criteria
 * 
 * @apiName deleteCriteria
 * @apiGroup Patient Criteria
 * 
 * @apiParam {Number} id - 24 digit HEX number doc id
 * 
 * @apiSuccess (200) {json} payload delete count
 * 
 */
// Delete to CDSInvocation MongoDB app /cds-data/criteria.js
module.exports.deleteCriteria = function(req, res) {
    req.logger.debug('Criteria DELETE called');

    var query = '';
    if (req.query && req.query.id) {
        query += req.query.id;
    }
    var url = 'http://' + criteriaStore.host + ':' + criteriaStore.port + '/patientlist/criteria/' + query;

    request.del({
        timeout : 50000,
        url : url
    }, function(error, response, body) {
        if (error) {
            res.status(rdk.httpstatus.internal_server_error).send(error);
            req.logger.debug('response: ' + error);
        }
        if (body) {
            req.logger.debug('response: ' + body);
        }
    }).pipe(res);
};
