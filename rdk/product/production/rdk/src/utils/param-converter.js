/* jslint node: true */
/* jshint bitwise: false */
'use strict';
var moment = require('moment');
var _ = require('underscore');

var WRITEBACK_INPUT_DATE_FORMAT = 'YYYYMMDD';
var WRITEBACK_INPUT_TIME_FORMAT = 'HHmmss';
var WRITEBACK_INPUT_DATETIME_FORMAT = 'YYYYMMDDHHmmss';
var WRITEBACK_INPUT_DATETIME_FORMAT_NO_SECONDS = 'YYYYMMDDHHmm';

var returnObject = function(arrayItems) {
    this.data = {
        items: [],
        success: true
    };
    this.data.items = arrayItems;
};

//returns a boolean
function isFloat(n) {
    return n === +n && n !== (n | 0);
}

//returns a boolean
function isInt(n) {
    return n === +n && n === (n | 0);
}

function celsiusToFahrenheit(celsius) {
    celsius = parseFloat(celsius);
    return ((celsius * 9) / 5) + 32;
}

function mmHGToCmH2O(mmHG) {
    return parseFloat(mmHG) * 1.35951002636;
}

/**
 *  Converts an array to a delimited list of RPC parameters
 *
 *  @param arrayOfParameters The array of parameters to convert
 *  @param delimiter An optional parameter to set the delimiter symbol. The default symbol is '^'
 *  @return A string of delimited RPC parameters
 */
function convertArrayToRPCParameters(arrayOfParameters, delimiter) {
    var rpcParamsArray = '';
    delimiter = delimiter || '^';

    if (typeof arrayOfParameters === 'undefined' || !(arrayOfParameters instanceof Array) || arrayOfParameters.length <= 0) {
        return rpcParamsArray;
    }

    arrayOfParameters.forEach(function(element, index) {
        rpcParamsArray += element;

        if (index < arrayOfParameters.length - 1) {
            rpcParamsArray += delimiter;
        }
    });

    return rpcParamsArray;
}

/**
 *  Converts the date/time input format for write-back (YYYYMMDD[HHmm[ss])
 *  to a moment date
 *
 *  @param dateTime A string date in YYYYMMMDD or YYYYMMDDHHmmss
 */
function convertWriteBackInputDate(dateTime) {
    if (dateTime.length === 8) {
        return new moment(dateTime, WRITEBACK_INPUT_DATE_FORMAT);
    } else if (dateTime.length === 14)  {
        return new moment(dateTime, WRITEBACK_INPUT_DATETIME_FORMAT);
    } else if (dateTime.length === 12) {
        return new moment(dateTime, WRITEBACK_INPUT_DATETIME_FORMAT_NO_SECONDS);
    } else {
        return undefined;
    }
}

/**
 *  Returns a request parameter as an integer, or <defaultVal> if the param
 *  is not present, or <errorVal> if the param cannot be converted to an int.
 *
 *  @param req The request object
 *  @param param The name of the parameter
 *  @param defaultVal (optional) The value to return if the param isn't present in the request
 *  @param errorVal (optional) The value to return if the param can't be converted to an int
 */
function parseIntParam(req, param, defaultVal, errorVal) {
    var val = req.param(param);

    if (val === undefined || val === null) {
        if (arguments.length > 2) {
            return defaultVal;
        }
        return val;
    }
    if (arguments.length > 2 && (val === null || val === undefined)) {
        return defaultVal;
    }
    val = parseInt(val);
    if (arguments.length > 3 && _.isNaN(val)) {
        return errorVal;
    }
    return val;
}

module.exports.isFloat = isFloat;
module.exports.isInt = isInt;
module.exports.returnObject = returnObject;
module.exports.convertArrayToRPCParameters = convertArrayToRPCParameters;
module.exports.celsiusToFahrenheit = celsiusToFahrenheit;
module.exports.mmHGToCmH2O = mmHGToCmH2O;
module.exports.convertWriteBackInputDate = convertWriteBackInputDate;
module.exports.parseIntParam = parseIntParam;
module.exports.WRITEBACK_INPUT_DATE_FORMAT = WRITEBACK_INPUT_DATE_FORMAT;
module.exports.WRITEBACK_INPUT_TIME_FORMAT = WRITEBACK_INPUT_TIME_FORMAT;
module.exports.WRITEBACK_INPUT_DATETIME_FORMAT = WRITEBACK_INPUT_DATETIME_FORMAT;
