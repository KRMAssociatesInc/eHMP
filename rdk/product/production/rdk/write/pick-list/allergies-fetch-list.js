/*jslint node: true */
'use strict';
var VistaJS = require('../core/VistaJS');
var parseSymptoms = require('./parsers/allergies-symptoms-parser').parseSymptoms;
var parseMatch = require('./parsers/allergies-match-parser').parseMatch;
var async = require('async');
var loggingUtil = require('./utils/logging-util');
var errorUtil = require('./utils/error-util');
var nullUtil = require('../core/null-utils');
var _ = require('lodash');

function callRpc4AllergiesSymptoms(log, configuration, allergies, searchString, callback) {
    VistaJS.callRpc(log, configuration, 'ORWDAL32 SYMPTOMS', searchString, '1', function(err, result) {
        if (err) {
            callback(err.message);
        }

        try {
            var json = parseSymptoms(log, result);
            allergies = allergies.concat(json);
            if (json.length === 44) {
                var localStartName = json[43].synonym;
                callRpc4AllergiesSymptoms(log, configuration, allergies, localStartName, callback);
                return;
            }
        }
        catch (error) {
            errorUtil.handleError(log, error.message, callback);
        }

        loggingUtil.logDebug(log, new Date() + " - results allergies symptoms: " + allergies.length);
        loggingUtil.logInfo(log, JSON.stringify(allergies));
        callback(null, allergies);
    });
}

module.exports.getAllergiesSymptoms = function(log, configuration, callback) {
    var allergies = [];
    loggingUtil.logDebug(log, new Date() + " - retrieving allergies symptoms");
    callRpc4AllergiesSymptoms(log, configuration, allergies, '', callback);
};


module.exports.getAllergiesMatch = function(log, configuration, searchString, callback) {
    if (nullUtil.isNullish(searchString) || _.isEmpty(searchString)) {
        callback("Parameter 'searchString' cannot be null or empty");
        return;
    }
    VistaJS.callRpc(log, configuration, 'ORWDAL32 ALLERGY MATCH', searchString, function(err, result) {
        if (err) {
            callback(err.message);
        }
        else {
            try {
                var json = parseMatch(log, result);
                callback(null, json);
            }
            catch (error) {
                callback(error.message);
            }
        }
    });
};
