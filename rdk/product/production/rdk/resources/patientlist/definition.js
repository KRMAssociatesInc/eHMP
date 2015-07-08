/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var cfg = require('./config');
var request = require('request');
var listener = cfg.DefinitionListener;

// ////////////////////////////////////////////////////////////
// Definition Template
// ////////////////////////////////////////////////////////////

/**
 * @api {get} /resource/patientlist/definition?id Request Definition
 * 
 * @apiName getDefinition
 * @apiGroup Patient Definition
 * 
 * @apiParam {Number} [id] - 24 digit HEX number
 * 
 * @apiSuccess (200) {json[]} payload definition A single Definition or Array of definitions
 * @apiError (404) {String} payload Not found
 * 
 */
//Get to CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.getDefinition = function(req, res) {
    //console.log('GET Definition called');

    var query = '';
    if (req.query && req.query.id) {
        query += '?id=' + req.query.id;
    }
    else if (req.query && req.query.name) {
        query += '?name=' + req.query.name;
    }
    query = (!query) ? '?' : query + '&';
    query += 'username=' + req.session.user.username;
    
    var url = 'http://' + listener.host + ':' + listener.port + '/patientlist/definition' + query;

    request.get({
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
 * @api {post} /resource/patientlist/definition Create Definition
 * 
 * @apiName postDefinition
 * @apiGroup Patient Definition
 * 
 * @apiHeader {json} request.body definition
 * 
 * @apiSuccess (201) {json} payload Definition JSON document
 * 
 */
// Post to CDSInvocation MongoDB app /cds-data/patientlist.js
module.exports.postDefinition = function(req, res) {
    //console.log('POST Definition called');

    var content = req.body;
    var url = 'http://' + listener.host + ':' + listener.port + '/patientlist/definition';

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
 * Delete a definition document
 * 
 * @api {delete} /resource/patientlist/definition?id Delete Definition
 * 
 * @apiName deleteDefinition
 * @apiGroup Patient Definition
 * 
 * @apiParam {Number} id - 24 digit HEX number doc id
 * 
 * @apiSuccess (200) {json} payload delete count
 * @apiError (404) {String} payload Not found
 * 
 */
module.exports.deleteDefinition = function(req, res) {
    //console.log('DELETE Definition called');

    var query = '';
    if (req.query && req.query.id) {
        query = req.query.id;
    }
    var url = 'http://' + listener.host + ':' + listener.port + '/patientlist/definition/' + query;

    request.del({
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
