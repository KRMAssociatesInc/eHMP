/*jslint node: true */
'use strict';

var _ = require('lodash');
var loggingUtil = require('../utils/logging-util');
var errorUtil = require('../utils/error-util');

//TODO: NEED TO PARSE OUT THE ALLERGEN WHEN WE GET INFORMATION BACK ABOUT HOW THE DATA WORKS - THIS IS A BEST GUESS SO FAR.
/*
THIS IS MY BEST EDUCATED GUESS AT WHAT THE DATA MIGHT BE.
Top Level
1-IEN
2-Name
3,4-Not populated
5-Always "TOP"
6-Always "+"

Regular Data
1-IEN
2-Name
3-?????????
4-?????????
5-?????????
*/
function createTopLevelAllergen(log, arr) {
    var allergen = {
        ien: arr[0],
        name: arr[1],
        top: arr[4],
        plus: arr[5]
    };
    return allergen;
}
function createRegularAllergen(log, arr) {
    var allergen = {
        ien: arr[0],
        name: arr[1],
        code1: arr[2],
        code2: arr[3],
        code3: arr[4]
    };
    return allergen;
}

/**
 * Takes the return string from the RPC 'ORWDAL32 ALLERGY MATCH' and parses out the data.<br/>
 * Allergy Allergens listing<br/>
 * ORWDAL32 ALLERGY MATCH<br/>
 * ALLSRCH^ORWDAL32<br/>
 * Given a text string, return a list of possible matches from several<br/>
 * different sources.<br/>
 * Search string text<br/>
 * Returns a list of all matching antigens. i.e.<br/>
 * Params ------------------------------------------------------------------<br/>
 * literal AMP<br/>
 * First piece IEN of entry^name of entry^location of entry^type of entry^<br/>
 * First two levels are top level file entries<br/>
 * Results -----------------------------------------------------------------<br/>
 * 1^VA Allergies File^^^TOP^+<br/>
 * 3^National Drug File - Generic Drug Name^^^TOP^+<br/>
 * 79^AMPICILLIN^PSNDF(50.6,"B")^D^3<br/>
 * 103^AMPHOTERICIN B^PSNDF(50.6,"B")^D^3<br/>
 * 109^AMPHOTERICIN B/TETRACYCLINE^PSNDF(50.6,"B")^D^3<br/>
 * 471^AMPICILLIN/PROBENECID^PSNDF(50.6,"B")^D^3<br/>
 * 482^AMPHETAMINE RESIN COMPLEX^PSNDF(50.6,"B")^D^3<br/>
 *
 * @param log The logger
 * @param str The string to parse
 * @returns {Array} An array containing the the ien, synonym, and name for each symptom.
 */
function parseMatch(log, str) {
    var retValue = [];
    var arr = str.split('\r\n');
    arr = _.filter(arr, Boolean); //Remove all of the empty Strings.

    _.forEach(arr, function(s) {
        var arr = s.split('^');
        if (arr.length === 6) {
            var topLevelAllergen = createTopLevelAllergen(log, arr);
            retValue.push(topLevelAllergen);
        }
        else if (arr.length === 5) {
            if (retValue.length === 0)
                errorUtil.throwError(log, "Cannot add a regular level allergen if no top level allergen has been created");

            var allergen = createRegularAllergen(log, arr);
            var allergens = retValue[retValue.length-1].allergens;
            if (allergens === undefined) {
                retValue[retValue.length-1].allergens = [];
                allergens = retValue[retValue.length-1].allergens;
            }
            allergens.push(allergen);
        }
        else {
            errorUtil.throwError("The RPC returned data but the allergen didn't contain data that we understood: " + str);
        }
    });

    loggingUtil.logInfo(log, JSON.stringify(retValue));
    return retValue;
}

module.exports.parseMatch = parseMatch;
