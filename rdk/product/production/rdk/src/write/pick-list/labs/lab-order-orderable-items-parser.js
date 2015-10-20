'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * @param logger The logger
 * @param line The string to parse, in the format: ien^synonym^name
 * @returns Object of the form: {ien: (item ien), synonym: (synonym of item name), name: (name of item)}
 */
function createOrderableItem(logger, line) {
    logger.debug('lab-order-orderable-items-parser.createOrderableItem(): Entering method. Line: %s', line);

    var FIELD_LENGTH_EXPECTED = 3;

    var field = line.split('^');
    if (field.length !== FIELD_LENGTH_EXPECTED) {
        logger.error('lab-order-orderable-items-parser.createOrderableItem(): Unexpected data in RPC result: %s', line);
        return null;
    }

    var obj = {
        ien: field[0],
        synonym: field[1],
        name: field[2]
    };

    logger.debug('lab-order-orderable-items-parser.createOrderableItem(): Parsed Orderable Item: %j', obj);
    return obj;
}

/**
 * Takes the return string from the RPC 'ORWDX ORDITM' and parses out the data.
 *
 * @param logger The logger
 * @param rpcData The string to parse, in the form: ien^synonym^name
 *                  Examples:
 *                      515^1,25-DIHYDROXYVIT D^1,25-DIHYDROXYVIT D
 *                      350^11-DEOXYCORTISOL^11-DEOXYCORTISOL
 *                      683^17-HYDROXYCORTICOSTEROIDS^17-HYDROXYCORTICOSTEROIDS
 * @returns Array of Orderable Item Objects (see above method for object contents)
 */
module.exports.parseLabOrderOrderableItems = function(logger, rpcData) {
    logger.debug('lab-order-orderable-items-parser.parseLabOrderOrderableItems(): Entering method');
    var retValue = [];

    if(!rpcData){
        logger.error('lab-order-orderable-items-parser.parseLabOrderOrderableItems(): rpcData was empty, null, or undefined');
        return retValue;
    }

    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var obj = createOrderableItem(logger, line);
        if (obj) {
            retValue.push(obj);
        }
    });

    logger.debug('lab-order-orderable-items-parser.parseLabOrderOrderableItems(): Parsing completed. Return value: %j', retValue);
    return retValue;
};