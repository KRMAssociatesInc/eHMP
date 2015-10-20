'use strict';
var fetch = require('../multifunction/orwpce-lex-lookup-fetch-list').getOrwpceLexLookUp;

/**
 * Calls the RPC 'ORWPCE LEX' and parses out the data.<br/>
 * to retrieve a list of specimens<br/><br/>
 *
 * Each element is as follows:<br/>
 * 1. ien<br/>
 * 2. name  (CODE)<br/>
 * A CODE can appear inside parentheses.<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.getEncountersDiagnosisLexiconLookup = function(logger, configuration, searchString, callback) {
    fetch(logger, configuration, searchString, 'ICD', 0, callback);
};
