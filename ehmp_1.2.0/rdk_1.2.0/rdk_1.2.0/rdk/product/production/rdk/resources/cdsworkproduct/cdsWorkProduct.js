/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var cfg = require('./config');
var workProductStore = cfg.WorkProductListener;

var request = require('request');

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {get} /inbox Retrieves 'inbox' for the authenticated user.
 * @apiName retrieveInbox
 * @apiGroup Preferences
 *
 * @apiSuccess {json} data A collection of objects containing the users inbox entries.
 */
module.exports.retrieveInbox = function (req, res) {
    req.logger.debug('CDS Work Product GET retrieveInbox called');

    var userId = getKeyValue(req.session.user.duz);
    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/inbox/' + encodeURIComponent(userId);

    request.get({
        url: url,
        timeout: 50000
    }, function(error/*, response , body*/){
        if(error) {
            res.status(rdk.httpstatus.internal_server_error).send(error);
        }
    }).pipe(res);
};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {get} /products Retrieves 'work products'.
 * @apiName retrieveWorkProducts
 * @apiGroup WorkProduct
 *
 * @apiParam {Number} startPeriod - optional start time for query
 * @apiParam {Number} endPeriod - optional end time for query
 *
 * @apiSuccess {json} data A collection of objects containing work products.
 */
module.exports.retrieveWorkProducts = function (req, res) {
    req.logger.debug('CDS Work Product GET getWorkProducts called');

    var query = '';
    if (req.query !== {}) {

        if (req.query.startPeriod !== undefined) {
            query += '?startPeriod=' + req.query.startPeriod;
        }
        if (req.query.endPeriod !== undefined) {
            query += '&endPeriod=' + req.query.endPeriod;
        }
    }

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/products' + query;

    request.get({
        url: url,
        timeout: 50000
    }, function(error, response/*, body*/){
        //NOTE:  If we use the response object above for anything - it's massive.  Look at it in
        //detail and make sure you actually need it.
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);
};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {post} /workproduct Creates work products.
 * @apiName createWorkProduct
 * @apiGroup WorkProduct
 *
 * @apiSuccess {json} data Created work product.
 *
 */
module.exports.createWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product POST createWorkProduct called');

    var content = req.body;
    //content.userId = getKeyValue(req.session.user.duz);

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/product/';

    request.post({
        url: url,
        timeout: 50000,
        json: content
    }, function(error, response /*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {get} /workproduct Gets a work product.
 * @apiName retrieveWorkProduct
 * @apiGroup WorkProduct
 *
 * @apiSuccess {json} data Json object containing the requested work product.
 *
 */
module.exports.retrieveWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product GET retrieveWorkProduct called');

    var id = req.param('id');

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/product/' + id;

    request.get({
        url: url,
        timeout: 50000
    }, function(error, response/*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {put} /workproduct Updates a work product.
 * @apiName updateWorkProduct
 * @apiGroup WorkProduct
 *
 * @apiSuccess {json} data Json object containing a one for successful match and update, zero if there was no record to update.
 *
 */
module.exports.updateWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product PUT updateWorkProduct called');

    var id = req.param('id');
    var content = req.body;

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/product/' + id;
    request.put({
          url: url,
          timeout: 50000,
          json: content
    }, function(error, response/*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {delete} /preferences Delete a work product.
 * @apiName deleteWorkProduct
 * @apiGroup WorkProduct
 *
 * @apiSuccess {json} data Json object containing a one for successful match and delete, zero if there was no record to delete.
 */
module.exports.deleteWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product DELETE deleteWorkProduct called');

    var id = req.param('id');

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/product/' + id;
    request.del({
        timeout: 50000,
        url: url
    }, function(error, response/*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};

function getKeyValue(obj) {
    var property;
    if (obj !== null) {
        for (property in obj) {
            if (property !== undefined) {
                return property + ':' + obj[property];
            }
        }
    }
    return 'BAD OBJECT';
}


/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {get} /preferences Retrieve user preferences for the authenticated user.
 * @apiName retrievePreferences
 * @apiGroup Preferences
 *
 * @apiSuccess {json} data A collection of string arrays containing the user's preferences.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *  "data": {
 *      "specialty": [
 *          "CC",
 *          "EMER",
 *          "GS"
 *      ],
 *      "priority": [
 *          "CR",
 *          "HI"
 *      ],
 *      "type": [
 *          "P"
 *       ]
 *   }
 * }
 */
module.exports.retrievePreferences = function (req, res) {
    req.logger.debug('CDS Work Product GET retrievePreferences called');

    var userId = getKeyValue(req.session.user.duz);
    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/preferences/' + encodeURIComponent(userId);

    request.get({
        url: url,
        timeout: 50000
    }, function(error, response/*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {put} /preferences Updates user preferences for the authenticated user.
 * @apiName updatePreferences
 * @apiGroup Preferences
 *
 * @apiSuccess {json} data Json object containing a one for successful match and update/create, zero if there was no record to update.
 */
module.exports.updatePreferences = function (req, res) {
    req.logger.debug('CDS Work Product PUT updatePreferences called');

    var userId = getKeyValue(req.session.user.duz);
    var content = req.body;

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/preferences/' + encodeURIComponent(userId);
    request.put({
          url: url,
          timeout: 50000,
          json: content
    }, function(error, response/*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};

/*
    Proxy to CDS-Data until the functionality can be moved into RDK codebase.
*/
/**
 * @api {delete} /preferences Updates user preferences for the authenticated user.
 * @apiName updatePreferences
 * @apiGroup Preferences
 *
 * @apiSuccess {json} data Json object containing a one for successful match and deletion, zero if there was no record to delete.
 */
module.exports.deletePreferences = function (req, res) {
    req.logger.debug('CDS Work Product DELETE deletePreferences called');

    var userId = getKeyValue(req.session.user.duz);

    var url = 'http://' + workProductStore.host +':'+workProductStore.port + '/work/preferences/' + encodeURIComponent(userId);
    request.del({
        timeout: 50000,
        url: url
    }, function(error, response/*, body*/){
        if (error) {
            var sts = (response !== undefined) ? response.ststusCode : rdk.httpstatus.internal_server_error;
            res.status(sts).send(error);
        }
    }).pipe(res);

};
