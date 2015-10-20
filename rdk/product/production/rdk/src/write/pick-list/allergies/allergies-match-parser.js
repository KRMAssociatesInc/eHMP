'use strict';

var _ = require('lodash');
var rpcUtil = require('./../utils/rpc-util');

/**
 * The top level data is what gets returned if no matches are found – for example passing in '   '.
 * Top level items always have 6 fields separated by ^'s.<br/>
 * 1-source<br/>
 * 2-name<br/>
 * 3,4-Not populated<br/>
 * 5-Always "TOP"<br/>
 * 6-Always "+"
 *
 * @param logger
 * @param fields an array of 6 items
 * @returns {{ien: *, name: *, top: *, plus: *}}
 */
function createTopLevelEntry(logger, fields) {
    var topLevel = {
        source: fields[0],
        categoryName: fields[1],
        top: fields[4],
        plus: fields[5]
    };

    if ('TOP' !== topLevel.top) {
        throw new Error('The Category wasn\'t a top level entry: fields=' + fields.join('^'));
    }

    logger.debug({allergen: topLevel});
    return topLevel;
}

/**
 * Regular level items always have 5 fields separated by ^'s.<br/>
 * 1-IEN (internal entry number)<br/>
 * 2-Name<br/>
 * 3-file (file it came out of)<br/>
 * 4-foodDrugOther (F,D,O - or any combination of those - stands for Food, Drug, Other)<br/>
 * 5-source (1,3,4,5,6,7 ==> 1 - VA Allergies File, 3 - National Drug File - Generic Drug Name, 4 - National Drug file - Trade Name, 5 - Local Drug File, 6 - Drug Ingredients File, 7 - VA Drug Class File)<br/>
 *
 * @param logger The logger
 * @param fields an array of 5 items
 * @returns {{ien: *, name: *, file: *, foodDrugOther: *, source: *}}
 */
function createAllergen(logger, fields) {
    var allergen = {
        ien: fields[0],
        name: fields[1],
        file: fields[2],
        foodDrugOther: fields[3],
        source: fields[4]
    };

    logger.debug({allergen: allergen});
    return allergen;
}

/**
 * Takes the return string from the RPC 'ORWDAL32 ALLERGY MATCH' and parses out the data.<br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * 1^VA Allergies File^^^TOP^+
 * 179^DIAL SOAP^GMRD(120.82,"B")^O^1
 * 762^DIALYSIS MEMBRANE^GMRD(120.82,"B")^O^1
 * 199^CONTRAST MEDIA <DIAGNOSTIC DYES>^GMRD(120.82,"D")^D^1
 * 3^National Drug File - Generic Drug Name^^^TOP^+
 * 91^DIATRIZOATE^PSNDF(50.6,"B")^D^3
 * 111^DIATRIZOATE/IODIPAMIDE^PSNDF(50.6,"B")^D^3
 * 127^DIATRIZOATE/IODINE^PSNDF(50.6,"B")^D^3
 * 4^National Drug file - Trade Name^^^TOP^+
 * 91^DIATRIZOATE MEGLUMINE INJECTION^PSNDF(50.67,"T")^D^4
 * 93^DIACETATE 40^PSNDF(50.67,"T")^D^4
 * 128^DIACHLOR^PSNDF(50.67,"T")^D^4
 * 167^DIAZEPAM INJECTION 10 MG/2ML^PSNDF(50.67,"T")^D^4
 * 167^DIAZEPAM INJECTION 10 MG/2 ML^PSNDF(50.67,"T")^D^4
 * 4973^DIABETIC TUSSIN NIGHT TIME^PSNDF(50.67,"T")^D^4
 * 5^Local Drug File^^^TOP^+
 * 7^Drug Ingredients File^^^TOP^+
 * 391^DIAZEPAM^PS(50.416,"P")^D^7
 * 1397^DIAZOXIDE^PS(50.416,"P")^D^7
 * 2332^DIATRIZOATE^PS(50.416,"P")^D^7
 * 2752^DIAZOLIDINYL UREA^PS(50.416,"P")^D^7
 * 4521^DIAMINOPYRIDINE^PS(50.416,"P")^D^7
 * 8^VA Drug Class File^^^TOP^+
 * 106^DIAGNOSTIC AGENTS^PS(50.605,"C")^D^8
 * 112^DIAGNOSTICS,OTHER^PS(50.605,"C")^D^8
 * 437^DIAGNOSTIC ANTIGENS^PS(50.605,"C")^D^8
 * 463^DIAPERS^PS(50.605,"C")^D^8
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 *
 * @param logger The logger
 * @param rpcData The string to parse
 * @returns {Array} An array containing top level and regular level allergens.
 */
module.exports.parseMatch = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    lines = rpcUtil.removeEmptyValues(lines);

    var TOP_LEVEL_FIELDS = 6;
    var SUB_LEVEL_FIELDS = 5;

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (fields.length === TOP_LEVEL_FIELDS) {
            var topLevel = createTopLevelEntry(logger, fields);
            retValue.push(topLevel);
        }
        else if (fields.length === SUB_LEVEL_FIELDS) {
            if (retValue.length === 0) {
                throw new Error('Cannot add a regular level allergen if no top level allergen has been created');
            }

            var allergen = createAllergen(logger, fields);
            var allergens = _.last(retValue).allergens;
            if (_.isUndefined(allergens)) {
                _.last(retValue).allergens = [];
                allergens = _.last(retValue).allergens;
            }
            allergens.push(allergen);
        }
        else {
            throw new Error('The RPC returned data but we couldn\'t understand it: ' + rpcData);
        }
    });

    logger.info({retValue: retValue});
    return retValue;
};
