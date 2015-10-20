'use strict';

var _ = require('lodash');
var async = require('async');
var S = require("string");
var http = require('../../utils/http');
var nullchecker = require('../../utils/nullchecker');

function asuProcessor(params) {
    var jsonResult;

    jsonResult = {
        got : params
    };

    return jsonResult;
}

function evaluate(jsonParams, appConfig, httpConfig, res, logger, outerceptor) {
    // pass the JSON POST data as the parameter to the evaluate function
    async.series([ function(callback) {
        logger.info('About to call ASU service');
        // call the ASU rules service (an external POST call)
        http.post(jsonParams, appConfig, httpConfig, function(err, data) {
            if (!(_.isUndefined(err) || _.isNull(err))) {
                logger.info('ASU evaluate facade got error ' + err);
                callback(true, err);
            } else {
                logger.info('ASU evaluate facade got response: ' + data);
                callback(false, data);
            }
        });
    }
    // other calls in serial go here go here
    ],
    /* Collate results */
    function(err, results) {
        logger.info('Inside ASU collate method');
        if (_.isUndefined(outerceptor)) {
            _evaluateFinished(err, results, res, logger);
        }
        else {
            logger.debug("ASU Outerceptor Result: " + results[0]);
            return outerceptor(err, results[0]);
        }
    }); // end of series
}

function _evaluateFinished(err, results, res, logger) {
    logger.info('Inside evaluate finished method');
    if (!(_.isUndefined(err) || _.isNull(err))) {
        logger.error('Error getting response from ASU service: ' + err);
        res.status(500).rdkSend(err);
        return;
    } else {
        logger.info('ASU authorize Response: ' + results[0]);
        var authorizeResponse = { isAuthorized: results[0] };
        res.rdkSend(authorizeResponse);
    }
}

function getDefaultUserClass(req, callback) {
    req.audit.logCategory = 'RETRIEVE';

    var site = req.session.user.site;

    var options = _.extend({}, req.app.config.jdsServer, {
        method: 'GET',
        path: '/data/find/asu-class?filter=(eq("name","USER")'
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };
    http.fetch(req.app.config, config, callback);
}


// Called by the ASU Interceptor
function getAsuPermission(req, documentDetails, callback) {
    var result = {};
    var extractedRoles = [];
    var userDetails = req.session.user;
    var logger = req.app.logger;
    var httpConfig = req.app.config.asu.evaluateRuleService;
    httpConfig.options.host = req.app.config.vxSyncServer.host;
    var possibleRoles = {
        "AUTHOR/DICTATOR": [
            "AUTHOR/DICTATOR",
            "Author (Dictator)",
            "AU"
        ],
        "ATTENDING PHYSICIAN": [
            "ATTENDING PHYSICIAN",
            "Attending Physician",
            "ATT"
        ],
        "TRANSCRIBER": [
            "TRANSCRIBER",
            "Transcriber",
            "TR"
        ],
        "EXPECTED COSIGNER":[
            "EXPECTED COSIGNER",
            "Expected Cosigner",
            "EC"
        ],
        "EXPECTED SIGNER": [
            "EXPECTED SIGNER",
            "Expected Signer",
            "ES"
        ],
        "SURROGATE":[
            "SURROGATE",
            "Surrogate",
            "SUR"
        ],
        "ADDITIONAL SIGNER":[
            "ADDITIONAL SIGNER",
            "Additional Signer",
            "X"
        ],
        "COMPLETER": [
            "COMPLETER",
            "Completer",
            "CP"
        ],
        "INTERPRETER": [
            "INTERPRETER",
            "Interpreter",
            "IN"
        ],
        "ENTERER": [
            "ENTERER",
            "Enterer",
            "E"
        ],
        "SIGNER": [
            "SIGNER",
            "Signer",
            "S"
        ],
        "COSIGNER": [
            "COSIGNER",
            "Cosigner",
            "C"
        ]
    };

    logger.debug("ASU Processing: " + JSON.stringify(documentDetails));
    if (nullchecker.isNullish(documentDetails)) {
        return callback(true, null);
    }

    // If error getting document any way return
    if (nullchecker.isNotNullish(documentDetails.error) ||
        (nullchecker.isNotNullish(documentDetails.data)
            && nullchecker.isNotNullish(documentDetails.data.error))) {
        return callback(true, documentDetails);
    }

    if (!_.isUndefined(documentDetails.data) &&  nullchecker.isNotNullish(documentDetails.data.items)) {
        _.forEach(documentDetails.data.items[0].clinicians, function (item) {
            _.forEach(possibleRoles, function (value, key) {
                if (!_.isNull(item.role) && !_.isUndefined(item.role) && _.include(value, item.role)) {
                    extractedRoles.push(key);
                }
            });
        });

        extractedRoles = _.uniq(extractedRoles);
    }
    else {
        logger.debug("ASU No roles found "+ documentDetails.data.items);
        return callback(true, documentDetails);
    }


    result.userClassUids = _.pluck(userDetails.vistaUserClass, 'uid');
    result.docDefUid = documentDetails.data.items[0].documentDefUid;
    result.docStatus = documentDetails.data.items[0].status;
    result.roleNames = extractedRoles;

    // If No user class we default to USER class
    if (_.isEmpty(userDetails.vistaUserClass)) {
        logger.debug("ASU No user class so fetching default");
        async.series({
            defaultUser: function(cb) {
                getDefaultUserClass(req,cb);
            }
        }, function(error, result){
            if (!_.isNull(error) || !_.isNull(result.defaultUser)) {
                logger.debug("Got an error fetching default USER class from JDS " + error);
                return callback(error, null);
            }

            var items = result.defaultUser.data.items;
            if (_.isEmpty(items)) {
                logger.debug("Could NOT find default USER class in JDS " + result.defaultUser);
                return callback(error, null);
            }
            _.forEach(items, function(item){
                if (S(item.uid).contains(req.session.user.site)) {
                    result.userClassUids = [];
                    result.userClassUids.push(item.uid);
                }
            });
        });
    }

    logger.debug("ASU document details sending for evaluation: " + JSON.stringify(result));

    evaluate(result, req.app.config, httpConfig, null, logger, callback);
}

module.exports._evaluateFinished = _evaluateFinished;
module.exports.asuProcessor = asuProcessor;
module.exports.evaluate = evaluate;
module.exports.getAsuPermission = getAsuPermission;
