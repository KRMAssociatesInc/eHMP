'use strict';

//------------------------------------------------------------------------------------
// This is a module that retrieves terminology information via REST service calls.
//
// @Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../env-setup');

var _ = require('underscore');
var config = require(global.OSYNC_ROOT + 'worker-config');
// var logUtil = require(global.VX_UTILS + 'log');
// logUtil.initialize(config.loggers);
// var log = logUtil.get('terminology-utils', 'host');
var util = require('util');
var request = require('request');
var querystring = require('querystring');

var CODE_SYSTEMS = {
	CODE_SYSTEM_UMLS_CUI: 'urn:oid:2.16.840.1.113883.6.86',
    CODE_SYSTEM_LOINC: 'http://loinc.org',
    CODE_SYSTEM_CVX: 'urn:oid:2.16.840.1.113883.12.292',
    CODE_SYSTEM_RXNORM: 'urn:oid:2.16.840.1.113883.6.88',
    CODE_SYSTEM_SNOMEDCT: 'http://snomed.info/sct',
	SYSTEM_DOD_ALLERGY_IEN: 'DOD_ALLERGY_IEN',
    SYSTEM_DOD_MEDCIN: 'DOD_MEDCIN',
    SYSTEM_DOD_NCID: 'DOD_NCID'
};

//------------------------------------------------------------------------------------------
// This will use the given conceptId to retrieve the JSON concept from the VA LOINC
// H2 database through the appropriate REST service endpoint.
//
// conceptId: The concept ID for the desired concept.
// callback: The callback handler to call when the request is completed.  The signature is:
//           function(error, concept)   Where:
//               error: Is the error if one occurs
//               concept: Is the attributes for this concept.
//------------------------------------------------------------------------------------------
function getVALoincConcept(conceptId, callback) {
    // Cannot translate if we have nothing to start with.
    //---------------------------------------------------
    if (!_.isString(conceptId)) {
        return callback(null, null);
    }

    var loincUrl = util.format('%s://%s:%s%s?%s',
            config.terminology.protocol,
            config.terminology.host,
            config.terminology.port,
            config.terminology.lncPath,
            querystring.stringify({
                concept: conceptId
            }));

    var options = {
        url: loincUrl,
        timeout: config.terminology.timeout
    };

    request(options, function(error, response, body) {
            if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
                callback('Received error response from terminology service');
            } else {
                if(body) {
                    callback(null, JSON.parse(body));
                } else {
                    callback(null, null);
                }
            }
        });
}

//------------------------------------------------------------------------------------------
// This will use the given conceptId to retrieve the JSON concept from the VA DRUG
// H2 database through the appropriate REST service endpoint.
//
// conceptId: The concept ID for the desired concept.
// callback: The callback handler to call when the request is completed.  The signature is:
//           function(error, concept)   Where:
//               error: Is the error if one occurs
//               concept: Is the attributes for this concept.
//------------------------------------------------------------------------------------------
function getVADrugConcept(conceptId, callback) {
    // Cannot translate if we have nothing to start with.
    //---------------------------------------------------
    if (!_.isString(conceptId)) {
        return callback(null, null);
    }

    var drugUrl = util.format('%s://%s:%s%s?%s',
            config.terminology.protocol,
            config.terminology.host,
            config.terminology.port,
            config.terminology.drugPath,
            querystring.stringify({
                concept: conceptId
            }));

    var options = {
        url: drugUrl,
        timeout: config.terminology.timeout
    };

    request(options, function(error, response, body) {
            if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
                callback('Received error response from terminology service');
            } else {
                if(body) {
                    callback(null, JSON.parse(body));
                } else {
                    callback(null, null);
                }
            }
        });
}

//-------------------------------------------------------------------------------------------
// This function takes a VA concept and uses finds the first concept in the sameas attribute
// that matches the targetCodeSystem and retrieves that concept.  It passes that to the
// callback.
//
// concept: The VA concept to use as the source of information.
// targetCodeSystem: The target code system for the lookup.  (i.e. 'ndfrt')
// callback: the callback handler to call when the request is completed.  The signature is:
//           function(error, concept)   Where:
//               error: Is the error if one occurs
//               concept: Is the attributes for the concept retrieved.
//-------------------------------------------------------------------------------------------
function getVAConceptMappingTo(concept, targetCodeSystem, callback) {
    if ((concept) && (!_.isEmpty(concept.sameas))) {
        var targetUrn = _.find(concept.sameas, function(urn) {
            return (urn.indexOf('urn:' + targetCodeSystem) >= 0);
        });

        if (targetUrn) {
            return getVADrugConcept(targetUrn, callback);
        } else {
            return callback(null, null);
        }
    } else {
        return callback(null, null);
    }
}

//------------------------------------------------------------------------------------------
// This will use the given mappingType and souceCode to retrieve the terminology code
// information that maps to this concept from the JLV H2 database through the appropriate
// REST service endpoint.
//
// mappingType: The type of mapping to retrieve.  The following is a list of valid values:
//              AllergyVUIDtoUMLSCui,
//              AllergyCHCSIenToUMLSCui,
//              AllergyDODNcidToUMLSCui,
//              LabUseLOINCtoGetText,
//              LabDODNcidToLOINC,
//              VitalsVuidToLoinc,
//              VitalsDODNcidToLoinc,
//              ProblemsIcd9ToSnomedCT,
//              ProblemsMedcinIdToSnomedCT,
//              MedicationVuidToRxNorm,
//              MedicationDodNcidToRxNorm,
//              NotesVuidToLoinc,
//              NotesDodNcidToLoinc,
//              ImmunizationCptToCvx
// sourceCode: The terminology code for the source of the mapping.
// callback: The callback handler to call when the request is completed.  The signature is:
//           function(error, jlvMappedCode)   Where:
//               error: Is the error if one occurs
//               jlvMappedCode: Is the information about the terminology code that the
//                              sourceCode maps to.
//------------------------------------------------------------------------------------------
function getJlvMappedCode(mappingType, sourceCode, callback) {
    // Cannot translate if we have nothing to start with.
    //---------------------------------------------------
    if (!_.isString(sourceCode)) {
        return callback(null, null);
    }

	if(!isMappingTypeValid(mappingType)) {
        // log.warn('terminology-utils.getJlvMappedCode: Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode);
        return callback(util.format('Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode));
    }

    var jlvUrl = util.format('%s://%s:%s%s?%s',
            config.terminology.protocol,
            config.terminology.host,
            config.terminology.port,
            config.terminology.jlvPath,
            querystring.stringify({
                type: mappingType,
                code: sourceCode
            }));

    var options = {
        url: jlvUrl,
        timeout: config.terminology.timeout
    };

    request(options, function(error, response, body) {
            if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
                callback('Received error response from terminology service');
            } else {
                if(body) {
                    callback(null, JSON.parse(body));
                } else {
                    callback(null, null);
                }
            }
        });
}

//------------------------------------------------------------------------------------------
// This will use the given mappingType and souceCode to retrieve the terminology code array
// information that maps to this concept from the JLV H2 database through the appropriate
// REST service endpoint.
//
// mappingType: The type of mapping to retrieve.  The following is a list of valid values:
//              AllergyVUIDtoUMLSCui,
//              AllergyCHCSIenToUMLSCui,
//              AllergyDODNcidToUMLSCui,
//              LabUseLOINCtoGetText,
//              LabDODNcidToLOINC,
//              VitalsVuidToLoinc,
//              VitalsDODNcidToLoinc,
//              ProblemsIcd9ToSnomedCT,
//              ProblemsMedcinIdToSnomedCT,
//              MedicationVuidToRxNorm,
//              MedicationDodNcidToRxNorm,
//              NotesVuidToLoinc,
//              NotesDodNcidToLoinc,
//              ImmunizationCptToCvx
// sourceCode: The terminology code for the source of the mapping.
// callback: The callback handler to call when the request is completed.  The signature is:
//           function(error, jlvMappedCodeList)   Where:
//               error: Is the error if one occurs
//               jlvMappedCodeList: Is the array of terminology codes that the
//                              sourceCode maps to.
//------------------------------------------------------------------------------------------
function getJlvMappedCodeList(mappingType, sourceCode, callback) {
    if(!isMappingTypeValid(mappingType)) {
        // log.warn('terminology-utils.getJlvMappedCode: Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode);
        return callback(util.format('Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode));
    }

    var jlvUrl = util.format('%s://%s:%s%s?%s',
            config.terminology.protocol,
            config.terminology.host,
            config.terminology.port,
            config.terminology.jlvListPath,
            querystring.stringify({
                type: mappingType,
                code: sourceCode
            }));

    var options = {
        url: jlvUrl,
        timeout: config.terminology.timeout
    };

    request(options, function(error, response, body) {
            if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
                callback('Received error response from terminology service');
            } else {
                if(body) {
                    callback(null, JSON.parse(body));
                } else {
                    callback(null, null);
                }
            }
        });
}

function isMappingTypeValid(mappingType) {
    if  (!_.contains(validMappingTypes, mappingType)) {
        return false;
    }
    return true;
}
var validMappingTypes = [
             'AllergyVUIDtoUMLSCui',
             'AllergyCHCSIenToUMLSCui',
             'AllergyDODNcidToUMLSCui',
             'LabUseLOINCtoGetText',
             'LabDODNcidToLOINC',
             'VitalsVuidToLoinc',
             'VitalsDODNcidToLoinc',
             'ProblemsIcd9ToSnomedCT',
             'ProblemsMedcinIdToSnomedCT',
             'MedicationVuidToRxNorm',
             'MedicationDodNcidToRxNorm',
             'NotesVuidToLoinc',
             'NotesDodNcidToLoinc',
             'ImmunizationCptToCvx'
    ];

module.exports.getVALoincConcept = getVALoincConcept;
module.exports.getVADrugConcept = getVADrugConcept;
module.exports.getVAConceptMappingTo = getVAConceptMappingTo;
module.exports.getJlvMappedCode = getJlvMappedCode;
module.exports.getJlvMappedCodeList = getJlvMappedCodeList;
module.exports.CODE_SYSTEMS = CODE_SYSTEMS;
module.exports._isMappingTypeValid = isMappingTypeValid;
module.exports._isMappingTypeValid.validTypes = validMappingTypes;
