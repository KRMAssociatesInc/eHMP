'use strict';

var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');

/*
    dodAllergyToVPR
    Transforms a single allergy event from DOD to VPR format

    Parameters:
    allergy - a single allergy in dod format, transliterated directly to JSON from xml
    edipi - the patient's edipi, required for generating the uid

    Returns:
    vprAllergy - a single allergy object in VPR format
*/
function dodAllergyToVPR(dodAllergy, edipi) {

    var vprAllergy = {};

    var allergyNameList = [];

    if (!_.isArray(dodAllergy.allergyName)) {
        allergyNameList[0] = dodAllergy.allergyName;
    } else {
        allergyNameList = dodAllergy.allergyName;
    }

    vprAllergy.products = _.map(allergyNameList, function(allergy) {
        return {
            name: allergy
        };
    });

    if (!_.isEmpty(vprAllergy.products)) {
        vprAllergy.summary = vprAllergy.products[0].name;
    }

    vprAllergy.codes = xformUtils.transformCodes(dodAllergy.codes);

    var commentList = [];

    if (!_.isArray(dodAllergy.comment)) {
        commentList[0] = dodAllergy.comment;
    } else {
        commentList = dodAllergy.comment;
    }

    if (!_.isNull(dodAllergy.comment)) {
        vprAllergy.comments = _.map(commentList, function(commentString) {
            return {
                comment: commentString
            };
        });
    }

    vprAllergy.facilityName = 'DOD';
    vprAllergy.facilityCode = 'DOD';
    vprAllergy.kind = 'Allergy/Adverse Reaction';
    vprAllergy.uid = uidUtils.getUidForDomain('allergy', 'DOD', edipi, dodAllergy.cdrEventId);
    vprAllergy.pid = 'DOD;' + edipi;

    return vprAllergy;

}

module.exports = dodAllergyToVPR;