'use strict';

var VistaJS = require('../../core/VistaJS');
var parse = require('./allergies-match-parser').parseMatch;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');

/**
 * Calls the RPC 'ORWDAL32 ALLERGY MATCH' and parses out the data.<br/>
 * to return a list of possible matches for the allergy from several different sources<br/><br/>
 *
 * The JSON is divided into 2 parts, top level items and regular level items (which are children of the top level items).<br/>
 * The top level data is what gets returned if no matches are found – for example passing in '   '.
 *
 * Top Level<br/>
 * 1-source<br/>
 * 2-name<br/>
 * 3-top (Always "TOP")<br/>
 * 4-plus (Always "+")
 *
 * Regular level items<br/>
 * 1-ien (internal entry number)<br/>
 * 2-name (external name)<br/>
 * 3-file (file it came out of)<br/>
 * 4-foodDrugOther (F,D,O - or any combination of those - stands for Food, Drug, Other)<br/>
 * 5-source (1,3,4,5,6,7 ==> 1 - VA Allergies File, 3 - National Drug File - Generic Drug Name, 4 - National Drug file - Trade Name, 5 - Local Drug File, 6 - Drug Ingredients File, 7 - VA Drug Class File)<br/>
 *
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param searchString The string that you want the RPC to perform the search with.<br/>
 * searchString is used when an RPC call requires a minimum of 3 characters in order to return data<br/>
 * This is not a filter - it is a search string.  For example, searching for RAD may return RADIACARE; however, searching for
 * DIA will not return RADIACARE.  Also, the search term may not always be the first 3 characters.  For example,
 * DIA will also return "CONTRAST MEDIA <DIAGNOSTIC DYES>".
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getAllergiesMatch = function(logger, configuration, searchString, callback) {
    if (validate.isStringLessThan3Characters(searchString))
        return callback('searchString is a required parameter and must contain 3 or more characters');

    searchString = searchString.toUpperCase();

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDAL32 ALLERGY MATCH', searchString, parse, callback);
};
