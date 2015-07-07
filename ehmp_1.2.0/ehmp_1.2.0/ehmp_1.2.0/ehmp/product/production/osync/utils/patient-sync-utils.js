'use strict';
var _ = require('lodash');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var nullUtil = require(global.OSYNC_UTILS + 'null-utils');


/**
 * logs an error and then throws the Exception using the errorMsg provided<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param errorMsg The message you want to have logged and the contents of the exception thrown.
 */
function throwError(errorMsg) {
    console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
    log.error("ERROR: " + errorMsg);
    throw errorMsg;
}

/**
 * Without the dfn, we wouldn't know what patient it was for.
 */
function validateResponse(response, isAdmission) {
    if (nullUtil.isNullish(response.dfn) || _.isEmpty(response.dfn))
        throwError("The RPC returned data missing the DFN field.");
}

/**
 * Takes the given string, splits it via the ^ and obtains dfn, date, locationName, roomBed, and locationIen from that information.
 *
 * @param str The string to split.
 * @returns {{dfn: *, date: *, locationName: *, roomBed: *, locationIen: *}}
 */
function parseRpcResponseAdmission(str) {
    if (str === "^^^^")
        throwError("The RPC returned empty data.");

    var arr = str.split('^');
    if (arr.length !== 5)
        throwError("The RPC returned data but was missing elements.");

    var response = {
        dfn: arr[0],
        date: arr[1],
        locationName: arr[2],
        roomBed: arr[3],
        locationIen: arr[4]
    };

    validateResponse(response, true);

    return response;
}

/**
 * Takes the given string, splits it via the ^ and obtains dfn, date, locationName, and locationIen from that information.
 *
 * @param str The string to split.
 * @returns {{dfn: *, date: *, locationName: *, locationIen: *}}
 */
function parseRpcResponseAppointment(str) {
    if (str === "^^^")
        throwError("The RPC returned empty data.");

    var arr = str.split('^');
    if (arr.length !== 4)
        throwError("The RPC returned data but was missing elements.");

    var response = {
        dfn: arr[0],
        date: arr[1],
        locationName: arr[2],
        locationIen: arr[3]
    };

    validateResponse(response, false);

    return response;
}

/**
 * Takes the given string, splits it via the ^ and obtains dfn, name from that information.
 *
 * @param str The string to split.
 * @returns {{dfn: *, name: *}}
 */
function parseRpcResponsePatientListData(str) {
    if (str === "^^^^^")
        throwError("The RPC returned empty data.");

    var arr = str.split('^');
    if (arr.length !== 6)
        throwError("The RPC returned data but was missing elements.");

    var response = {
        dfn: arr[0],
        name: arr[1]
    };

    validateResponse(response, false);

    return response;
}

/**
 * Splits the RPC's string via the '\r\n' and then calls parseRpcResponseAdmission for each line of data.
 *
 * @param str The string to parse.
 * @returns {Array} An array of objects containing the Admissions.
 */
function parseRpcResponseAdmissions(str) {
    if (nullUtil.isNullish(str) || _.isEmpty(str))
        throwError("The RPC didn't return any data.");

    var response = [];
    var arr = str.split('\r\n');

    arr = _.filter(arr, Boolean); //Remove all of the empty Strings.
    _.forEach(arr, function(n) {
        //console.log(n);
        var pat = parseRpcResponseAdmission(n);
        response.push(pat);
    });

    return response;
}

/**
 * Splits the RPC's string via the '\r\n' and then calls parseRpcResponseAppointment for each line of data.
 *
 * @param str The string to parse.
 * @returns {Array} An array of objects containing the Appointments.
 */
function parseRpcResponseAppointments(str) {
    if (nullUtil.isNullish(str) || _.isEmpty(str))
        throwError("The RPC didn't return any data.");

    var response = [];
    var arr = str.split('\r\n');

    arr = _.filter(arr, Boolean); //Remove all of the empty Strings.
    _.forEach(arr, function(n) {
        var pat = parseRpcResponseAppointment(n);
        response.push(pat);
    });

    return response;
}

/**
 * Splits the RPC's string via the '\r\n' and then calls parseRpcResponsePatientListData for each line of data.
 *
 * @param str The string to parse.
 * @returns {Array} An array of objects containing the Patients.
 */
function parseRpcResponsePatientList(str) {
    if (nullUtil.isNullish(str) || _.isEmpty(str))
        throwError("The RPC didn't return any data.");

    var response = [];
    var arr = str.split('\r\n');

    arr = _.filter(arr, Boolean); //Remove all of the empty Strings.
    _.forEach(arr, function(n) {
        var pat = parseRpcResponsePatientListData(n);
        response.push(pat);
    });

    return response;
}

module.exports.parseRpcResponseAdmissions = parseRpcResponseAdmissions;
module.exports.parseRpcResponseAppointments = parseRpcResponseAppointments;
module.exports.parseRpcResponsePatientList = parseRpcResponsePatientList;