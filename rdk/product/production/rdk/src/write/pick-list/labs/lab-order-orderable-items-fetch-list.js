'use strict';

var VistaJS = require('../../core/VistaJS');
var parse = require('./lab-order-orderable-items-parser').parseLabOrderOrderableItems;
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');
var _ = require('lodash');

/**
 * Calls the RPC 'ORWDX ORDITM' once and parses out the data to retrieve a list of 44 records at a time<br/><br/>
 *
 * @param logger The logger.
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param searchString The location to start returning data from - call with an empty String to retrieve the start of the data.
 * To retrieve the next set of 44 records, call this with the value contained in the 44th records "synonym" field.
 * @param callback This will be called with the array of data retrieved from multiple calls to the RPC (or if there's an error).
 */
module.exports.getLabOrderOrderableItemsDirectRpcCall = function(logger, configuration, searchString, labType, callback) {
    logger.info('lab-order-orderable-items-fetch-list.getLabOrderOrderableItemsDirectRpcCall(): entering method');

    if (validate.isStringNullish(labType)) {
        return callback('labType cannot be empty');
    }
    if (validate.isStringNullish(searchString)) {
        searchString = '';
    }

    searchString = searchString.toUpperCase();
    labType = labType.toUpperCase();

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDX ORDITM', searchString, '1', labType, parse, callback);
};

/**
 * Calls the RPC 'ORWDX ORDITM' repeatedly and parses out the data.<br/><br/>
 *
 * If there are more than 44 results, we get back exactly 44 records. At that point, we call the exact same RPC call
 * again passing in the value of the name from the last record (the 44th record).<br/>
 * This will continue until we receive less than 44 records.<br/><br/>
 *
 * FOR MORE INFORMATION ON RPC PAGINATION WITH 44 RECORDS, LOOK AT &quot;rpc-util.removeExistingEntriesFromRPCResult&quot;<br/><br/>
 *
 * Because of pagination with this RPC call, it is a recursive function.<br/>
 * For those worried about recursive functions, it took 2283 recursive calls to an RPC before it blew up
 * with the Maximum call stack size exceeded on my machine (tested multiple times). That means 100,452 individual records
 * would need to be coming back to a pick list before you would ever run into an issue (something that would never happen).
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param retValue An array that will be populated by the recursive function - this array will be passed to the callback.
 * @param labType - The type of lab order for which to get a list of orderable items
 * @param searchString The location to start returning data from - call with an empty String to retrieve all of the data.
 * @param callback This will be called with the array of data retrieved from multiple calls to the RPC (or if there's an error).
 */
function callRpc4LabOrderOrderableItems(logger, configuration, retValue, searchString, labType, callback) {
    logger.debug('callRpc4LabOrderOrderableItems(): entering method: searchString=' + searchString + ', labType=' + labType);
    VistaJS.callRpc(logger, configuration, 'ORWDX ORDITM', searchString, '1', labType, function(err, rpcData) {
        if (err) {
            return callback(err.message);
        }
        if (validate.isStringNullish(rpcData)) {
            return callback('rpc did not return any data');
        }

        var MAX_RPC_RESULTS_RETURNED = 44;
        try {
            logger.debug(rpcData);
            var obj = parse(logger, rpcData);

            var localStartName = obj.length > 0 ? _.last(obj).synonym : null;

            var callAgain = false;
            if (obj.length === MAX_RPC_RESULTS_RETURNED) {
                callAgain = true;
            }

            obj = rpcUtil.removeExistingEntriesFromRPCResult(logger, retValue, obj);

            retValue = retValue.concat(obj);

            if (callAgain) {
                callRpc4LabOrderOrderableItems(logger, configuration, retValue, localStartName, labType, callback);
                return;
            }
        }
        catch (parseAndRpcUtilError) {
            return callback(parseAndRpcUtilError.message);
        }

        callback(null, retValue);
    });
}

/**
 * Calls the RPC 'ORWDX ORDITM' repeatedly and parses out the data<br/><br/>
 *
 * @param logger The logger.
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param labType - The type of lab order for which to get a list of orderable items
 * @param callback This will be called with the array of data retrieved from multiple calls to the RPC (or if there's an error).
 */
function getLabOrderOrderableItems(logger, configuration, labType, callback) {
    if (!labType) {
        return callback('labType is a required parameter');
    }
    if (validate.isStringNullish(labType)) {
        return callback('labType cannot be empty');
    }

    callRpc4LabOrderOrderableItems(logger, configuration, [], '', labType.toUpperCase(), callback);
}

module.exports.getLabOrderOrderableItems = getLabOrderOrderableItems;
module.exports.fetch = function(logger, configuration, callback, params) {
    getLabOrderOrderableItems(logger, configuration, _.get(params, 'labType'), callback);
};
