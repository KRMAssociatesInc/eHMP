'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');
var validate = require('./../utils/validation-util');

/**
 * The top level data is what gets returned if no matches are found.
 * Top level items always have 2 fields separated by ^'s.<br/>
 * 1-not used<br/>
 * 2-name<br/><br/>
 *
 * Example: ^********OFFICE VISIT********
 *
 * @param logger
 * @param fields an array of items to populate the top level entry with.
 */
function createTopLevelEntry(logger, fields) {
    var topLevel = {
        categoryName: fields[1]
    };

    logger.debug({topLevel: topLevel});
    return topLevel;
}

/**
 * Regular level items always have 9 fields separated by ^'s.<br/>
 * In the form Code^Description^unused1^unused2^unused3^usrDefTxt^code2^code3^clinicalLexiconTerm
 *
 * @param logger The logger
 * @param fields an array of items to populate the entry with.
 */
function createEntry(logger, fields) {
    var entry = {
        ien: fields[0],
        name: fields[1]
        //we don't use the other 7 fields.
    };

    logger.debug({entry: entry});
    return entry;
}

/**
 * Takes the return string from the RPC 'ORWPCE PROC' and parses out the data.<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * 25
 * ^
 * ^********OFFICE VISIT********
 * ^***CONSULTATION***
 * 99242^INTERMEDIATE (30min)^^^^^^^
 * 99243^EXTENDED (40min)^^^^^^^
 * 99244^COMPREHENSIVE (1hr)^^^^^^^
 * ^***NEW PATIENT***
 * 99202^INTERMEDIATE (20min)^^^^^^^
 * 99203^EXTENDED (30min)^^^^^^^
 * 99204^COMPREHENSIVE (45min)^^^^^^^
 * ^***ESTABLISHED PATIENT***
 * 99212^LIMITED (10min)^^^^^^^
 * 99213^INTERMEDIATE (15min)^^^^^^^
 * 99214^EXTENDED (25min)^^^^^^^
 * ^***INITIAL POST-OP VISIT***
 * 99024^(ROUTINE CARE ONLY)^^^^^^^
 * ^****************************************
 * ^DEBRIDEMENT
 * 11000^SURGICAL CLEANSING OF SKIN^^^^^^^
 * 11042^      -SKIN & SUB-Q^^^^^^^
 * ^OTHER
 * 93970^DOPPLER VEINS^^^^^^^
 * 93923^DOPPLER ARTERIES^^^^^^^
 * 36468^INJ(S);SPIDER VEINS^^^^^^^
 * 29580^UNNA BOOT^^^^^^^
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 *
 *
 * @param logger The logger
 * @param rpcData The string to parse
 */
module.exports.parseEncountersProcedureTypes = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    var NUM_ROWS_RETURNED_LINE = 1;
    var TOP_LEVEL_FIELDS = 2;
    var SUB_LEVEL_FIELDS = 9;

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === TOP_LEVEL_FIELDS) {
            var topLevel = createTopLevelEntry(logger, fields);

            if (topLevel.categoryName === '****************************************') {
                logger.debug('ignoring category with title: ****************************************');
            }
            else if (validate.isStringNullish(topLevel.categoryName)) {
                logger.debug('ignoring empty categoryName');
            }
            else {
                retValue.push(topLevel);
            }
        }
        else if (fields.length === SUB_LEVEL_FIELDS) {
            if (retValue.length === 0) {
                throw new Error('Cannot add a regular level entry if no top level entry has been created');
            }

            var entry = createEntry(logger, fields);
            var cptCodes = _.last(retValue).cptCodes;
            if (_.isUndefined(cptCodes)) {
                _.last(retValue).cptCodes = [];
                cptCodes = _.last(retValue).cptCodes;
            }
            cptCodes.push(entry);
        }
        else if (fields.length === NUM_ROWS_RETURNED_LINE) {
            logger.debug('There are ' + fields.length + ' rows being returned from the RPC "ORWPCE PROC"');
        }
        else {
            throw new Error('The RPC "ORWPCE PROC" returned data but we couldn\'t understand it: ' + rpcData);
        }
    });

    //console.log(JSON.stringify(retValue, null, 2));
    logger.info({retValue: retValue});
    return retValue;
};
