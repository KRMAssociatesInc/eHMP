'use strict';
var parse = require('./orwpce-lex-lookup-parser').parseOrwpceLexLookUp;
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');
var nullUtil = require('../../core/null-utils');

/**
 * Calls the RPC 'ORWPCE LEX' and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param searchString The string that you want the RPC to perform the search with.<br/>
 * searchString is used when an RPC call requires a minimum of 3 characters in order to return data<br/>
 * This is not a filter - it is a search string.  For example, searching for RAD may return RADIACARE; however, searching for
 * DIA will not return RADIACARE.  Also, the search term may not always be the first 3 characters.  For example,
 * DIA will also return "CONTRAST MEDIA <DIAGNOSTIC DYES>".
 * @param view the type of data to return - known values we've seen used elsewhere are:<br/>
 * CHP (unknown how this is used - in our limited testing it returned the same data as CPT)<br/>
 * ICD (Diagnoses International Clinical Diagnosis code (version 9 or 10))<br/>
 * CPT (Current Procedure Terminology (they are the codes that define what the provider did they can bill for))
 * @param date 0=today
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getOrwpceLexLookUp = function(logger, configuration, searchString, view, date, callback) {
    if (validate.isStringLessThan3Characters(searchString)) {
        return callback('searchString is a required parameter and must contain 3 or more characters');
    }
    //if (validate.isStringNullish(view)) {
    //    return callback('view cannot be empty');
    //}
    if (nullUtil.isNullish(date)) {
        date = 0;
    }

    searchString = searchString.toUpperCase();
    view = view.toUpperCase();

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE LEX', searchString, view, date, parse, callback);
};
