'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * Name of category
 *
 * @param logger
 * @param fields an array of items to populate the top level entry with.
 */
function createTopLevelEntry(logger, fields) {
    var topLevel = {
        source: fields[0],
        categoryName: fields[1]
    };

    logger.debug({topLevel: topLevel});
    return topLevel;
}

/**
 * diagnostic entry
 *
 * @param logger The logger
 * @param fields an array of items to populate the entry with.
 */
function createEntry(logger, fields) {
    //currently does not appear that values 2-8 are used based on existing research
    var entry = {
        icdCode: fields[0],
        name: fields[1],
        description: fields[9]
    };

    logger.debug({entry: entry});
    return entry;
}

/**
 * Takes the return string from the RPC 'ORWPCE DIAG' and parses out the data.<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * 15
 * ^ANEURYSMS
 * 441.3^ABDOMINAL, RUPTURED^^^^^^^^ABDOMINAL ANEURYSM, RUPTURED
 * 441.4^ABDOMINAL, NO RUPTURE^^^^^^^^ABDOMINAL ANEURYSM WITHOUT MENTION OF RUPTURE
 * 442.3^FEMORAL/POPLITEAL^^^^^^^^ANEURYSM OF ARTERY OF LOWER EXTREMITY
 * 442.2^ILIAC^^^^^^^^ANEURYSM OF ILIAC ARTERY
 * 903.1^PSEUDOANEUR,AVF,POST CARD CATH^^^^^^^^INJURY TO BRACHIAL BLOOD VESSELS
 * 903.1^   BRACHIAL ARTERY^^^^^^^^INJURY TO BRACHIAL BLOOD VESSELS
 * 904.0^   COMMON FEMORAL ARTER^^^^^^^^INJURY TO COMMON FEMORAL ARTERY
 * 442.0^UPPER EXTREMITY^^^^^^^^ANEURYSM OF ARTERY OF UPPER EXTREMITY
 * 442.84^VISCERAL ANEURYSM NEC^^^^^^^^ANEURYSM OF OTHER VISCERAL ARTERY
 * ^ARTERIAL DISEASE
 * 785.9^ARTERIAL BRUIT/DECREASED PULSE^^^^^^^^OTHER SYMPTOMS INVOLVING CARDIOVASCULAR SYSTEM
 * 443.1^BUERGER'S DISEASE^^^^^^^^THROMBOANGIITIS OBLITERANS (BUERGER'S DISEASE)
 * 444.22^   ART FEMORAL/POPLITEAL/LWR EXTREM^^^^^^^^ARTERIAL EMBOLISM AND THROMBOSIS OF LOWER EXTREMITY
 * 444.81^   ILIAC ARTERY^^^^^^^^EMBOLISM AND THROMBOSIS OF ILIAC ARTERY
 * 444.21^   UPPER EXTREMITY ARTERY^^^^^^^^ARTERIAL EMBOLISM AND THROMBOSIS OF UPPER EXTREMITY
 * ^OTHERS
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 *
 *
 * @param logger The logger
 * @param rpcData The string to parse
 */
module.exports.parseEncountersDiagnosisCodesForClinic = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    var TOP_LEVEL_FIELDS = 2;
    var SUB_LEVEL_FIELDS = 10;

    var count = lines.shift();
    logger.info('Diagnostic entries found: ' + count);

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === TOP_LEVEL_FIELDS) {
            var topLevel = createTopLevelEntry(logger, fields);
            retValue.push(topLevel);
        }
        else if (fields.length === SUB_LEVEL_FIELDS) {
            if (retValue.length === 0) {
                throw new Error('Cannot add a regular level entry if no top level entry has been created');
            }

            var entry = createEntry(logger, fields);
            var diagnostics = _.last(retValue).values;

            if (_.isUndefined(diagnostics)) {
                _.last(retValue).values = [];
                diagnostics = _.last(retValue).values;
            }
            diagnostics.push(entry);
        }
        else {
            throw new Error('The RPC "ORWDLR32 DEF" returned data but we couldn\'t understand it: ' + rpcData);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
