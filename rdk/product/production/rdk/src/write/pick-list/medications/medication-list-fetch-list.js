'use strict';

var VistaJS = require('../../core/VistaJS');
var parse = require('./medication-list-parser').parseMedicationList;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');


/**
 * Calls the RPC 'ORWUL FV4DG' and parses out the data to retrieve Outpatient Medication ORDER QUICK VIEW file #101.44
 * subset of orderable items or quick orders in alphabetical order to specific sequence numbers.<br/><br/>
 *
 * Each element is as follows:<br/>
 * ien<br/>
 * totalCountOfItems
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param searchString Examples: 'NV RX' or 'O RX'.<br/>
 * searchString is used when an RPC call requires a minimum of 3 characters in order to return data<br/>
 * This is not a filter - it is a search string.  For example, searching for RAD may return RADIACARE; however, searching for
 * DIA will not return RADIACARE.  Also, the search term may not always be the first 3 characters.  For example,
 * DIA will also return "CONTRAST MEDIA <DIAGNOSTIC DYES>".
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getMedicationList = function(logger, configuration, searchString, callback) {
    if (validate.isStringLessThan3Characters(searchString))
        return callback('searchString is a required parameter and must contain 3 or more characters');

    searchString = searchString.toUpperCase();

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWUL FV4DG', searchString, parse, callback);
};
