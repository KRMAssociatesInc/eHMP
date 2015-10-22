'use strict';
var VistaJS = require('../../core/VistaJS');
var parse = require('./encounters-visit-disabilities-parser').parseDisabilities;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWPCE SCDIS' and parses out the data.<br/>
 *
 * input:dfn<br/>
 * 1. code<br/>
 * 2. name <br/>
 * 3. title<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param dfn
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 */
function getDisabilities(logger, configuration, dfn, callback) {
    if (validate.isStringNullish(dfn)) {
        return callback('DFN Cannot be Empty');
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE SCDIS', parse, callback);
}

module.exports.getDisabilities = getDisabilities;
module.exports.fetch = function(logger, configuration, callback, params) {
    getDisabilities(logger, configuration, _.get(params, 'dfn'), callback);
};
