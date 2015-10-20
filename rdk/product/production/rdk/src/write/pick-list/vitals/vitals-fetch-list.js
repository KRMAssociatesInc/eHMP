'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./vitals-parser').parseVitals;
var rpcUtil = require('./../utils/rpc-util');

/**
 * Retrieves the vitals, categories, and qualifiers<br/><br/>
 *
 * If it's a vital, it will have these 4 fields:<br/>
 * ien<br/>
 * name<br/>
 * abbreviation<br/>
 * pceAbbreviation<br/><br/>
 *
 * If the vital type is Blood Pressure it will also have:<br/>
 * abnormalSystolicHigh<br/>
 * abnormalDiastolicHigh<br/>
 * abnormalSystolicLow<br/>
 * abnormalDiastolicLow<br/><br/>
 *
 * If vital type is Temperature, Respiration, Pulse, Central Venous Pressure it will also have:<br/>
 * abnormalHigh<br/>
 * abnormalLow<br/><br/>
 *
 * If vital type is Central Pressure it will also have:<br/>
 * abnormalO2Saturation<br/><br/>
 *
 * Categories (contained in Vitals) have these fields:<br/>
 * ien<br/>
 * name<br/><br/>
 *
 * Qualifier's (contained in Categories) have these fields:<br/>
 * ien<br/>
 * name<br/>
 * synonym
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
module.exports.fetch = function (logger, configuration, callback) {
    return rpcUtil.standardRPCCall(logger, configuration, 'GMV VITALS/CAT/QUAL', '', parse, callback);
};
