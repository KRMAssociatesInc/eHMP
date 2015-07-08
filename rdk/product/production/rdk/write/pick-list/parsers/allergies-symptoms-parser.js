/*jslint node: true */
'use strict';

var _ = require('lodash');
var loggingUtil = require('../utils/logging-util');
var errorUtil = require('../utils/error-util');

/**
 * 1 = symptom IEN<br/>
 * 2 = second piece is the synonym<br/>
 * 3 = third piece is the name<br/>
 * Where there is not a third piece, the synonym and name are the same.<br/>
 * There there is a third piece, the synonym will contain a tab character followed by the name (same as 3rd field)
 * surrounded by less than and greater than symbols.
 *
 * @param log The logger
 * @param str The string to parse
 */
function createSymptom(log, str) {
    loggingUtil.logDebug(log, "symptom=" + str);

    var arr = str.split('^');
    if (arr.length !== 3 && arr.length !== 2)
        errorUtil.throwError("The RPC returned data but the symptom didn't contain data that we understood: " + str);

    var qualifier = {
        ien: arr[0],
        synonym: arr[1],
        name: arr.length === 3 ? arr[2] : arr[1]
    };

    loggingUtil.logDebug(log, JSON.stringify(qualifier));
    return qualifier;
}

/**
 * Takes the return string from the RPC 'ORWDAL32 SYMPTOMS' and parses out the data.
 *
 * @param log The logger
 * @param str The string to parse
 * @returns {Array} An array containing the the ien, synonym, and name for each symptom.
 */
function parseSymptoms(log, str) {
    var retValue = [];
    var arr = str.split('\r\n');
    arr = _.filter(arr, Boolean); //Remove all of the empty Strings.

    _.forEach(arr, function(s) {
        var symptom = createSymptom(log, s);
        retValue.push(symptom);
    });

    loggingUtil.logDebug(log, JSON.stringify(retValue));
    return retValue;
}

module.exports.parseSymptoms = parseSymptoms;
