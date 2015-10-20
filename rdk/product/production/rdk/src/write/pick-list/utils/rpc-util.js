'use strict';
var _ = require('lodash');
var nullUtil = require('../../core/null-utils');
var VistaJS = require('../../core/VistaJS');

//----------------------------------------------------------------------------------------------------------------------
//                               Calling RPC's in a standard way
//----------------------------------------------------------------------------------------------------------------------
/**
 * Calls a VistA RPC and returns the data.  parameters can be zero or more arguments.
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param rpcName the name of the RPC to call
 * @param parameters the parameters to pass to the RPC (can be zero or more parameters).
 * @param parse This will be called with the data retrieved from the RPC to parse into JSON.
 * @param callback This will be called with the parsed json data retrieved from the RPC (or if there's an error).
 */
module.exports.standardRPCCall = function(logger, configuration, rpcName, parameters, parse, callback) {
    //The following code is a close duplication of the code in VistaJS.callRpc for validation.
    if (!rpcName) {
        return callback('no rpc parameter was passed to standardRPCCall()');
    }

    if (arguments.length < 5) {
        return callback('Invalid number of arguments passed to standardRPCCall()');
    }

    if (!(arguments[arguments.length - 1] instanceof Function)) {
        return callback('No callback function was passed to standardRPCCall()');
    }

    if (!(arguments[arguments.length - 2] instanceof Function)) {
        return callback('No parse function was passed to standardRPCCall()');
    }

    callback = arguments[arguments.length - 1];
    parse = arguments[arguments.length - 2];

    var params = [];
    if (arguments.length > 5) {
        var args = _.toArray(arguments);
        params = _.map(args.slice(3, args.length - 2), function(param) {
            return param;
        });
    }

    params = _.flatten(params, true);
    params = _.filter(params, function(param) {
        return param !== null && param !== undefined;
    });
    //End the following code is a close duplication of the code in VistaJS.callRpc for validation.

    VistaJS.callRpc(logger, configuration, rpcName, params, function(err, rpcData) {
        if (err)
            return callback(err.message);

        try {
            logger.debug(rpcData);
            var obj = parse(logger, rpcData);
            callback(null, obj);
        }
        catch (parseError) {
            return callback(parseError.message);
        }
    });
};

//----------------------------------------------------------------------------------------------------------------------
//                               Duplicate Entry Removal Functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * This method will create a duplicate of arrFromRPC by comparing the records in arrFromRPC to the records in
 * arrExistingEntries.  If it finds any duplicates, it will not include them in the results returned.<br/>
 * If arrExistingEntries is null or not an array an exception will be thrown<br/>
 * If arrFromRPC is null or not an array an exception will be thrown<br/>
 * If arrExistingEntries is empty, arrFromRPC will be returned unaltered<br/>
 * If arrFromRPC is empty, an empty array will be returned<br/><br/>
 *
 * Note, this function does NOT ensure there are no duplicates in the arrFromRPC array - it only makes sure
 * the entries in arrFromRPC don't already exist in arrExistingEntries.<br/><br/>
 *
 * <font color="red">NOTE: It is important that you retrieve the name from the 44th record (to give to the recursive
 * RPC call) before calling this function in case that record is one that is removed.</font><br/><br/><br/><br/>
 *
 *
 * The RPC call will not return everything from the call but will only return 44 records starting at (or after) the
 * string you pass in (it's not an exact match of that string but the record closest to what you passed in).<br/><br/>
 *
 * Pass in an empty String to start at the beginning of the list (if the RPC call doesn't allow an empty String then we have a problem).<br/><br/>
 *
 * When it comes to anything that involves pagination in CPRS (ex. searching for a patient) if there are more than
 * 44 results, we get back exactly 44 records. At that point, we call the exact same RPC call again passing in the
 * value of the name from the last record (the 44th record). This would continue until we receive less than 44 records.<br/><br/>
 *
 * Pagination here is similar to a lookup in a phone book. If you want to find someones name, you pick the first name in the
 * book that is similar to the name you are looking for and put your finger on the name. Then, start scanning down the
 * list of names from there for 44 names total.  You haven't reached the end of the book. If you want 44 more names,
 * move your finger 44 names down in the book. Then look at the next 44 names starting at your finger.<br/><br/>
 *
 * <u>Note 1</u> (handled by this method)<br/>
 * What if you had 50 records and records 40-48 all were the name "JOHN DOE", what would happen when you attempted to
 * retrieve records 45-50, what would you get? The first 44 records will contain 4 entries for "JOHN DOE". When you
 * search again for "JOHN DOE", you will not get record 45, you will start at record 40 (the first "JOHN DOE") and will get the
 * rest of the records up to 50. In total, you will get 10 records with that second call and 4 of them will be duplicates
 * of existing entries from that first call.<br/><br/>
 *
 * <u>Note 2</u> (handled by this method)<br/>
 * Another situation exists where the 45th result (1st record of that new search) is identical to the 44th result
 * (last record of the previous search). See "Duplicates with Allergy Symptoms RPC Calls.txt" in the docs folder.<br/><br/>
 *
 * <u>Note 3</u> (due to the unlikely nature of this happening, it is not handled)<br/>
 * What if we had 200 patients all called “JOHN DOE”. In this case the 44th record would contain “JOHN DOE” and you’d
 * get the exact same result set back (i.e. you'd be in an infinite loop of getting the same 44 records and wouldn't
 * ever get records 45-200). The exact same thing would happen in CPRS and then the end user would at that point
 * change their type of search to last initial and ssn.<br/><br/>
 *
 * @param log The logger
 * @param arrExistingEntries An array with at le
 * @param arrFromRPC
 */
module.exports.removeExistingEntriesFromRPCResult = function(log, arrExistingEntries, arrFromRPC) {
    if (nullUtil.isNullish(arrExistingEntries)) {
        throw new Error('arrExistingEntries cannot be null');
    }
    if (nullUtil.isNullish(_.isArray(arrExistingEntries))) {
        throw new Error('arrExistingEntries must be an array');
    }
    if (nullUtil.isNullish(arrFromRPC)) {
        throw new Error('arrFromRPC cannot be null');
    }
    if (nullUtil.isNullish(_.isArray(arrFromRPC))) {
        throw new Error('arrFromRPC must be an array');
    }

    if (_.isEmpty(arrExistingEntries)) {
        return arrFromRPC;
    }
    if (_.isEmpty(arrFromRPC)) {
        return [];
    }

    var retvalue = _.filter(arrFromRPC, function(n) {
        var add = true;
        _.each(arrExistingEntries, function(item) {
            var json1 = JSON.stringify(n);
            var json2 = JSON.stringify((item));
            if (json1 === json2) {
                add = false;
                return false; //break out of the loop.
            }
        });
        return add;
    });
    return retvalue;
};

//----------------------------------------------------------------------------------------------------------------------
//                               Conversion Functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Converts a boolean value to the characters 'Y' or 'N' as the RPC needs those specific characters to work.
 */
module.exports.convertBooleanToYN = function(myBool) {
    return myBool ? 'Y' : 'N';
};

/**
 * Removes all empty strings from the given array
 */
module.exports.removeEmptyValues = function(arr) {
    return _.filter(arr, Boolean);
};
