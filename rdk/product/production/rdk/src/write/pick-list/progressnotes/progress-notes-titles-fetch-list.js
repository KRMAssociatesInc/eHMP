'use strict';

var VistaJS = require('../../core/VistaJS');
var parse = require('./progress-notes-titles-parser').parseProgressNotesTitles;
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');
var _ = require('lodash');

/**
 * Calls the RPC 'TIU LONG LIST OF TITLES' once and parses out the data to retrieve a list of 44 records at a time<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param searchString The location to start returning data from - call with an empty String to retrieve the start of the data.
 * To retrieve the next set of 44 records, call this with the value contained in the 44th records "name" field.
 * @param classParam "Class" of progress notes titles to return (required by the RPC).
 * @param callback This will be called with the array of data retrieved from multiple calls to the RPC (or if there's an error).
 */
module.exports.getProgressNotesTitlesDirectRpcCall = function(logger, configuration, searchString, classParam, callback) {
    if (validate.isStringNullish(classParam)) {
        return callback('class cannot be empty');
    }

    logger.info('Retrieving ProgressNotesTitles');
    if (validate.isStringNullish(searchString)) {
        searchString = '';
    }
    searchString = searchString.toUpperCase();
    return rpcUtil.standardRPCCall(logger, configuration, 'TIU LONG LIST OF TITLES', classParam, searchString, '1', parse, callback);
};

/**
 * Calls the RPC 'TIU LONG LIST OF TITLES' repeatedly and parses out the data.<br/><br/>
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
 * @param classParam "Class" of progress notes titles to return (required by the RPC).
 * @param retValue An array that will be populated by the recursive function - this array will be passed to the callback.
 * @param searchString The location to start returning data from - call with an empty String to retrieve all of the data.
 * @param callback This will be called with the array of data retrieved from multiple calls to the RPC (or if there's an error).
 */
function callRpc4ProgressNotesTitles(logger, configuration, classParam, retValue, searchString, callback) {
    logger.debug('callRpc4LabOrderOrderableItems(): entering method: searchString=' + searchString + ', classParam=' + classParam);
    VistaJS.callRpc(logger, configuration, 'TIU LONG LIST OF TITLES', classParam, searchString, '1', function(err, rpcData) {
        if (err) {
            return callback(err.message);
        }
        if (validate.isStringNullish(rpcData)) {
            return callback('rpc did not return any data');
        }

        var MAX_RPC_RESULTS_RETURNED = 44; //RPC calls will return no more than 44 records if they support pagination (see javadoc).
        try {
            logger.debug(rpcData);
            var obj = parse(logger, rpcData);

            var localStartName = obj.length > 0 ? _.last(obj).name : null;

            var callAgain = false;
            if (obj.length === MAX_RPC_RESULTS_RETURNED) {
                callAgain = true;
            }

            obj = rpcUtil.removeExistingEntriesFromRPCResult(logger, retValue, obj);

            retValue = retValue.concat(obj);

            if (callAgain) {
                callRpc4ProgressNotesTitles(logger, configuration, classParam, retValue, localStartName, callback);
                return;
            }
        }
        catch (parseAndRpcUtilError) {
            return callback(parseAndRpcUtilError.message);
        }

        logger.info('count of retValue progress notes titles: ' + retValue.length);
        logger.info({retValue: retValue});
        callback(null, retValue);
    });
}

/**
 * Calls the RPC 'TIU LONG LIST OF TITLES' repeatedly and parses out the data<br/><br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param classParam "Class" of progress notes titles to return (required by the RPC).
 * @param callback This will be called with the array of data retrieved from multiple calls to the RPC (or if there's an error).
 */
function getProgressNotesTitles(logger, configuration, classParam, callback) {
    if (validate.isStringNullish(classParam)) {
        return callback('class cannot be empty');
    }

    callRpc4ProgressNotesTitles(logger, configuration, classParam, [], '', callback);
}

module.exports.getProgressNotesTitles = getProgressNotesTitles;
module.exports.fetch = function(logger, configuration, callback, params) {
    getProgressNotesTitles(logger, configuration, _.get(params, 'class'), callback);
};
