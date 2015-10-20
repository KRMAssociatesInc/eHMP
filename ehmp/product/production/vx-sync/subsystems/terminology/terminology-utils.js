'use strict';

//------------------------------------------------------------------------------------
// This is a module that retrieves terminology information via REST service calls.
//
// @Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../env-setup');

var _ = require('underscore');
var util = require('util');
var request = require('request');
var querystring = require('querystring');
var uuid = require('node-uuid');

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

function TerminologyUtil(log, metricsLog, config) {
    this.log = log;
    this.config = config;
    this.metrics = metricsLog;
}

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
TerminologyUtil.prototype.getVALoincConcept = function(conceptId, callback) {
    var self = this;
    var metricsObj = {'subsystem':'Terminology', 'action':'getVALoincConcept', 'process':uuid.v4(),'timer': 'start'};
    self.metrics.debug('Terminology Loinc Concept', metricsObj);
    // Cannot translate if we have nothing to start with.
    //---------------------------------------------------
    if (!_.isString(conceptId)) {
        return callback(null, null);
    }

    var loincUrl = util.format('%s://%s:%s%s?%s',
            self.config.terminology.protocol,
            self.config.terminology.host,
            self.config.terminology.port,
            self.config.terminology.lncPath,
            querystring.stringify({
                concept: conceptId
            }));

    var options = {
        url: loincUrl,
        timeout: self.config.terminology.timeout
    };

    request(options, function(error, response, body) {
        metricsObj.timer = 'stop';
        if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
            self.metrics.debug('Terminology Loinc Concept in Error', metricsObj);
            callback('Received error response from terminology service');
        } else {
            self.metrics.debug('Terminology Loinc Concept', metricsObj);
            if(body) {
                callback(null, JSON.parse(body));
            } else {
                callback(null, null);
            }
        }
    });
};

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
TerminologyUtil.prototype.getVADrugConcept = function(conceptId, callback) {
    var self = this;
    var metricsObj = {'subsystem':'Terminology', 'action':'getVADrugConcept', 'process':uuid.v4(),'timer': 'start'};
    self.metrics.debug('Terminology Drug Concept', metricsObj);
    // Cannot translate if we have nothing to start with.
    //---------------------------------------------------
    if (!_.isString(conceptId)) {
        return callback(null, null);
    }

    var drugUrl = util.format('%s://%s:%s%s?%s',
            self.config.terminology.protocol,
            self.config.terminology.host,
            self.config.terminology.port,
            self.config.terminology.drugPath,
            querystring.stringify({
                concept: conceptId
            }));

    var options = {
        url: drugUrl,
        timeout: self.config.terminology.timeout
    };

    request(options, function(error, response, body) {
        metricsObj.timer = 'stop';
        if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
            self.metrics.debug('Terminology Drug Concept in Error', metricsObj);
            callback('Received error response from terminology service');
        } else {
            self.metrics.debug('Terminology Drug Concept', metricsObj);
            if(body) {
                callback(null, JSON.parse(body));
            } else {
                callback(null, null);
            }
        }
    });
};

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
TerminologyUtil.prototype.getVAConceptMappingTo = function(concept, targetCodeSystem, callback) {
    if ((concept) && (!_.isEmpty(concept.sameas))) {
        var targetUrn = _.find(concept.sameas, function(urn) {
            return (urn.indexOf('urn:' + targetCodeSystem) >= 0);
        });

        if (targetUrn) {
            return this.getVADrugConcept(targetUrn, callback);
        } else {
            return callback(null, null);
        }
    } else {
        return callback(null, null);
    }
};

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
TerminologyUtil.prototype.getJlvMappedCode = function(mappingType, sourceCode, callback) {
    var self = this;
    var metricsObj = {'subsystem':'Terminology', 'action':'getJlvMappedCode', 'process':uuid.v4(),'timer': 'start'};
    self.metrics.debug('Terminology JLV Mapped Code', metricsObj);
    // Cannot translate if we have nothing to start with.
    //---------------------------------------------------
    if (!_.isString(sourceCode)) {
        return callback(null, null);
    }

	if(!this.isMappingTypeValid(mappingType)) {
        // log.warn('terminology-utils.getJlvMappedCode: Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode);
        return callback(util.format('Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode));
    }

    var jlvUrl = util.format('%s://%s:%s%s?%s',
            self.config.terminology.protocol,
            self.config.terminology.host,
            self.config.terminology.port,
            self.config.terminology.jlvPath,
            querystring.stringify({
                type: mappingType,
                code: sourceCode
            }));

    var options = {
        url: jlvUrl,
        timeout: self.config.terminology.timeout
    };

    request(options, function(error, response, body) {
        metricsObj.timer = 'stop';
        if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
            self.metrics.debug('Terminology JLV Mapped Code in Error', metricsObj);
            callback('Received error response from terminology service');
        } else {
            self.metrics.debug('Terminology JLV Mapped Code', metricsObj);
            if(body) {
                callback(null, JSON.parse(body));
            } else {
                callback(null, null);
            }
        }
    });
};

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
TerminologyUtil.prototype.getJlvMappedCodeList = function(mappingType, sourceCode, callback) {
    var self = this;
    var metricsObj = {'subsystem':'Terminology', 'action':'getJlvMappedCodeList', 'process':uuid.v4(),'timer': 'start'};
    self.metrics.debug('Terminology JLV Mapped Code', metricsObj);
    metricsObj.timer = 'stop';
    if(!this.isMappingTypeValid(mappingType)) {
        // log.warn('terminology-utils.getJlvMappedCode: Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode);
        self.metrics.debug('Terminology JLV Mapped Code in Error', metricsObj);
        return callback(util.format('Invalid mapping type requested.  mappingType: %s; sourceCode: %s', mappingType, sourceCode));
    }

    var jlvUrl = util.format('%s://%s:%s%s?%s',
            self.config.terminology.protocol,
            self.config.terminology.host,
            self.config.terminology.port,
            self.config.terminology.jlvListPath,
            querystring.stringify({
                type: mappingType,
                code: sourceCode
            }));

    var options = {
        url: jlvUrl,
        timeout: self.config.terminology.timeout
    };

    request(options, function(error, response, body) {
        if(error || (response && response.statusCode !== 200 && response.statusCode !== 204)) {
            self.metrics.debug('Terminology JLV Mapped Code in Error', metricsObj);
            callback('Received error response from terminology service');
        } else {
            self.metrics.debug('Terminology JLV Mapped Code', metricsObj);
            if(body) {
                callback(null, JSON.parse(body));
            } else {
                callback(null, null);
            }
        }
    });
};

TerminologyUtil.prototype.isMappingTypeValid = function(mappingType) {
    if  (!_.contains(validMappingTypes, mappingType)) {
        return false;
    }
    return true;
};
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
TerminologyUtil.prototype.CODE_SYSTEMS = CODE_SYSTEMS;

module.exports = TerminologyUtil;
module.exports.CODE_SYSTEMS = CODE_SYSTEMS;
module.exports.validTypes = validMappingTypes;
