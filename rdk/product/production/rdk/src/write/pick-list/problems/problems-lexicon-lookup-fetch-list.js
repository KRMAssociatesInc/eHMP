'use strict';
var fetch = require('../multifunction/orqqpl4-lex-lookup-fetch-list').getOrqqpl4LexLookUp;

/**
 * Returns the following data for Problems:<br/>
 * lexIen<br/>
 * prefText<br/>
 * icdCodes<br/>
 * icdIen<br/>
 * codeSys<br/>
 * conceptId<br/>
 * desigId<br/>
 * icdVer
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param searchString The string that you want the RPC to perform the search with.<br/>
 * searchString is used when an RPC call requires a minimum of 3 characters in order to return data<br/>
 * This is not a filter - it is a search string.  For example, searching for RAD may return RADIACARE; however, searching for
 * DIA will not return RADIACARE.  Also, the search term may not always be the first 3 characters.  For example,
 * DIA will also return "CONTRAST MEDIA <DIAGNOSTIC DYES>".
 * @param date (optional) 0 = today - if not supplied, 0 will be used.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getProblemsLexiconLookup = function(logger, configuration, searchString, date, callback) {
    fetch(logger, configuration, searchString, 'PLS', date, callback);
};
