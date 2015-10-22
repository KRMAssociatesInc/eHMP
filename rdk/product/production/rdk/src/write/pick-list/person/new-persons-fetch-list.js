'use strict';
var parse = require('./new-persons-parser').parseProviders;
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');


/**
 * Calls the RPC 'ORWU NEWPERS' and parses out the data.<br/>
 * to retrieve Available Providers <br/><br/>
 *
 * Each element is as follows:<br/>
 * 1. code<br/>
 * 2. name <br/>
 * 3. title<br/><br/>
 *
 *
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getNewPersons = function(logger, configuration, searchString, newPersonsType, dateTime, callback) {
    if (!validate.isStringNullish(searchString)) {
        searchString = searchString.toUpperCase();
    }
    else {
        searchString = '';
    }

    if (newPersonsType === undefined) {
        newPersonsType = '';
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWU NEWPERS', searchString, '1', newPersonsType, dateTime, parse, callback);
};

