'use strict';

var _ = require('lodash');
var rpcCategoryTransformer = require('../utils/rpc-categories-tilde-transformer');
var rpcUtil = require('../utils/rpc-util');
var validate = require('../utils/validation-util');

/**
 * ~Priority<br/>
 * i+delimited string = entry<br/>
 * d+delimited string = default
 */
function addPriority(logger, retValue, categoryName, type, arr) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 2, arr, categoryName)) {
        return;
    }
    var categoryEntry = {
        ien: arr[0],
        name: arr[1]
    };
    if (rpcUtil.CATEGORY_DEFAULT_ENTRY === type) {
        rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, arr, categoryEntry);
    }
    else {
        rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, arr, categoryEntry);
    }
}

/**
 * ~DispMsg<br/>
 * d+delimited string = default
 */
function addDispMsg(logger, retValue, categoryName, type, arr) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 1, arr, categoryName)) {
        return;
    }
    var categoryEntry = {
        ien: arr[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, arr, categoryEntry);
}

/**
 * ~Refills<br/>
 * d+delimited string = default
 */
function addRefills(logger, retValue, categoryName, type, arr) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 2, arr, categoryName)) {
        return;
    }
    var categoryEntry = {
        ien: arr[0],
        name: arr[1]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, arr, categoryEntry);
}

/**
 * ~Pickup<br/>
 * d+delimited string = default
 */
function addPickup(logger, retValue, categoryName, type, arr) {
    if (!rpcCategoryTransformer.validateCategoryArraySize(logger, 2, arr, categoryName)) {
        return;
    }
    var categoryEntry = {
        ien: arr[0],
        name: arr[1]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, arr, categoryEntry);
}

/**
 * The RPC returns data in the following format:<br/>
 * ~category<br/>
 * i+delimited string = entry<br/>
 * d+delimited string = default<br/>
 * t+string = text<br/><br/>
 *
 * The RPC returns defaults (if available) for:<br/>
 * ~Priority<br/>
 * ~DispMsg<br/>
 * ~Refills<br/>
 * ~Pickup<br/><br/>
 *
 * Example:<br/>
 * ORWDPS1 ODSLCT<br/>
 * Params ------------------------------------------------------------------<br/>
 * literal O<br/>
 * literal 241<br/>
 * literal 32<br/>
 * Results -----------------------------------------------------------------<br/>
 * ~Priority<br/>
 * i2^ASAP<br/>
 * i9^ROUTINE<br/>
 * i1^STAT<br/>
 * d9^ROUTINE<br/>
 * ~DispMsg<br/>
 * d0<br/>
 * ~Refills<br/>
 * d0^0<br/>
 * ~Pickup<br/>
 * dW^at Window
 *
 * @param logger The Logger
 * @param fields an array of 2 items
 */
function addCategoryEntry(logger, retValue, categoryName, fields) {
    if (!fields && fields.length === 0) {
        throw new Error('fields must have at least one entry');
    }

    var type = fields[0][0];
    fields[0] = fields[0].substring(1); //Remove the type from the first entry

    if (categoryName === 'Priority') {
        addPriority(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'DispMsg') {
        addDispMsg(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Refills') {
        addRefills(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Pickup') {
        addPickup(logger, retValue, categoryName, type, fields);
    }
    else {                               //This is an unknown entry
        throw new Error('unknown category entry: ' + categoryName);
    }
}

/**
 * Takes the return string from the RPC 'ORWDPS1 ODSLCT' and parses out the data.<br/><br/>
 *
 * The RPC returns data in the following format:<br/>
 * ~category<br/>
 * i+delimited string = entry<br/>
 * d+delimited string = default<br/>
 * t+string = text<br/><br/>
 *
 * The RPC returns defaults (if available) for:<br/>
 * ~Priority<br/>
 * ~DispMsg<br/>
 * ~Refills<br/>
 * ~Pickup<br/>
 *
 * Each element is as follows:<br/>
 *
 *
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseMedicationDefaults = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    var categoryName = null;
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (rpcCategoryTransformer.isCategoryEntry(fields)) {
            categoryName = fields[0].substring(1);
            var category = {
                categoryName: categoryName
            };

            logger.debug({category: category});
            retValue.push(category);
        }
        else {
            addCategoryEntry(logger, retValue, categoryName, fields);
        }
    });

    //console.log(JSON.stringify(retValue, null, 2));
    logger.info({retValue: retValue});
    return retValue;
};
