'use strict';

var _ = require('lodash');
var rpcCategoryTransformer = require('../utils/rpc-categories-tilde-transformer');
var rpcUtil = require('../utils/rpc-util');

function addSampleTime(logger, retValue, categoryName, fields) {
    var SAMP_FIELD_LENGTH_1 = 10;
    var SAMP_FIELD_LENGTH_2 = 8;
    var SPECIMEN_FIELD_LENGTH_2 = 2;

    var type = fields[0][0];
    var categoryEntry;

    if (fields.length === SAMP_FIELD_LENGTH_1) {

        categoryEntry = {
            ien: fields[1],
            name: fields[2],
            specPtr: fields[3],
            tubeTop: fields[4],
            labCollect: fields[7],
            specName: fields[9]
        };
    } else if (fields.length === SAMP_FIELD_LENGTH_2) {
        categoryEntry = {
            ien: fields[1],
            name: fields[2]
        };
    } else if (fields.length === SPECIMEN_FIELD_LENGTH_2) {
        type = 'i';

        categoryEntry = {
            ien: fields[0],
            name: fields[1]
        };
    } else if (fields.length === 1) {
        categoryEntry = fields[0];
    } else {
        categoryEntry = {};
    }

    addEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

function addEntry(logger, retValue, categoryName, type, fields, categoryEntry) {
    if (rpcCategoryTransformer.CATEGORY_DEFAULT_ENTRY === type) {
        rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
    } else {
        rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
    }
}


/**
 * Since we know the names of our categories, this method determines which method to call based on the category.
 */
function addCategoryEntry(logger, retValue, categoryName, fields) {
    if (categoryName === null) {
        throw new Error('Cannot add a category entry if no category has been created: ' + fields[0]);
    }
    if (!fields && fields.length === 0) {
        throw new Error('fields must have at least one entry');
    }

    if (fields.length === 2 || fields.length === 8 || fields.length === 10) {
        addSampleTime(logger, retValue, categoryName, fields);
    }
    else {
        logger.error('The RPC "ORWDLR32 ALLSAMP" returned data but we couldn\'t understand it: unknown category entry "' + categoryName + '"');
    }
}

/**
 * Takes the return string from the RPC 'ORWDLR32 ALLSAMP' and parses out the data.<br/><br/>
 *
 * Each element is as follows:<br/>
 * ~CollSamp
 * List of all collection samples<br>/
 * ~Specimens
 * List of all specimens<br/>
 * @param logger The logger
 * @param rpcData The String from the RPC that you want parsed
 * @returns {Array}
 */
module.exports.parseLabSamples = function(logger, rpcData) {
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

            logger.debug({categoryName: categoryName});
            retValue.push(category);
        }
        else {
            addCategoryEntry(logger, retValue, categoryName, fields);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
