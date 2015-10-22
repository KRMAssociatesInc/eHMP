'use strict';

var _ = require('underscore');
var nameCase = require(global.VX_UTILS + 'namecase-utils').namecase;
var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for problem data.
//
// @Author:  Les Westberg, J.Vega
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
// This method transfroms and enriches the problem record.
//
// log: The logger to send log messages to.
// config: The configuration information
// environment: The environment handles and context.
// record: The record enrichment object to be processed.
// callback: This is the handler to call when the enrichment transformation is done.
//                  function(error, record)  where:
//                       Error is the error that occurred.
//                       record is the transformed and enriched record.
//--------------------------------------------------------------------------------
function transformAndEnrichRecord(log, config, environment, record, callback) {
	log.debug('record-enrichment-problem-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

    // Make sure we have something to work with.
    //------------------------------------------
    if (!record) {
        log.warn('record-enrichment-problem-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
        return setTimeout(callback, 0, null, null);
    }

    var terminologyUtils;
    if (environment.terminologyUtils) {
        terminologyUtils = environment.terminologyUtils;
    } else {
        terminologyUtils = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
    }

    fixFieldDataTypes(record);
    addMissingFields(record);
    addTerminologyCodeTranslations(record, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
        log.debug('record-enrichment-problem-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
        return callback(error, recordWithTerminologyCodes);
    });

}

function fixFieldDataTypes(record){
    if(record.facilityCode) {record.facilityCode = String(record.facilityCode);}
    if(record.localId) {record.localId = String(record.localId);}
    if(record.entered) {record.entered = String(record.entered);}
    if(record.onset) {record.onset = String(record.onset);}
    if(record.updated) {record.updated = String(record.updated);}
    if(record.resolved) {record.resolved = String(record.resolved);}
    if(record.lastUpdateTime) {record.lastUpdateTime = String(record.lastUpdateTime);}
    if(record.stampTime) {record.stampTime = String(record.stampTime);}
}

function addMissingFields(record) {
    if(record.providerName){
        record.providerDisplayName = nameCase(record.providerName);
    }
    if(record.locationName){
        record.locationDisplayName = nameCase(record.locationName);
    }
    if(record.statusName){
        record.statusDisplayName = nameCase(record.statusName);
    }
    record.serviceConnected = !!(record.serviceConnected);
    record.summary = record.problemText;
    record.kind = 'Problem';
    if(record.icdCode && /(^urn:icd:)/.test(record.icdCode)){
        record.icdGroup = getIcdGroup(record.icdCode);
    }

    if(!_.isEmpty(record.comments)){
        _.each(record.comments, function(comment){
            comment.summary = recEnrichXformerUtil.getSummary('ProblemComment', comment);
        });
    }
}

function getIcdGroup(icdStr){
    //If icdcode starts with 'urn:icd:'
    //And icdcode is at least 11 characters long
    //And icdcode has a  '.' in it
    //Get the string after 'urn:icd:' but before the '.'
    var dotIndex = icdStr.indexOf('.');
    if(icdStr.length >= 11 && dotIndex > 0){
        return icdStr.substring(8, dotIndex);
    }
    return null;
}

function addTerminologyCodeTranslations(record, log, terminologyUtils, callback){
    log.debug('record-enrichment-problem-xformer.addTerminologyCodeTranslations: Entered method: record: %j', record);

    if (recEnrichXformerUtil.recordContainsCode(terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_SNOMEDCT, record)) {
        log.debug('record-enrichment-problem-xformer.addTerminologyCodeTranslations: Record already contains this terminology code: CodeSystem: %s; record: %j', terminologyUtils.CODE_SYSTEMS.CODE_SYSTEM_SNOMEDCT, record);
        return callback(null, record);
    }

    var mappingType;
    var sourceCode;
    var doMapping = false;

    if(isVaResult(record)){
        mappingType = 'ProblemsIcd9ToSnomedCT';
        sourceCode = getProblemIcd9Code(record);
        log.debug('record-enrichment-problem-xformer.addTerminologyCodeTranslations: Problem Event is a VA problem.  ICD-9: %s', sourceCode);
        doMapping = true;
    }else if(isDodResult(record, terminologyUtils)){
        mappingType = 'ProblemsMedcinIdToSnomedCT';
        sourceCode = getProblemDodMedcinId(record,terminologyUtils);
        log.debug('record-enrichment-problem-xformer.addTerminologyCodeTranslations: Problem Event is a DOD allergy.  DOD MEDCIN ID: %s', sourceCode);
        doMapping = true;
    } else{
        log.debug('record-enrichment-problem-xformer-xformer.addTerminologyCodeTranslations: Problem Event is NOT a VA or DOD problem;  No terminology lookup will be done.');
    }

    if(doMapping){
        terminologyUtils.getJlvMappedCode(mappingType, sourceCode, function(error, jlvMappedCode) {
            log.debug('record-enrichment-problem-xformer.addTerminologyCodeTranslations: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

            if (jlvMappedCode) {
                var jdsCode = recEnrichXformerUtil.convertMappedCodeToJdsCode(jlvMappedCode);
                if (jdsCode) {
                    if (_.isEmpty(record.codes)) {
                        record.codes = [jdsCode];
                    } else {
                        record.codes = record.codes.concat(jdsCode);
                    }
                }
            }

            return callback(error, record);
        });
    } else {
        return callback(null, record);
    }
}

function isVaResult(record){
    //return(!isDodResult(record));
    return !!getProblemIcd9Code(record);
}

function isDodResult(record, terminologyUtils){
    //return /(:DOD:)/.test(record.uid);
    return !!getProblemDodMedcinId(record, terminologyUtils);
}

function getProblemIcd9Code(record){
    return stripIcd9CodeFromUrn(record.icdCode) || '';
}

function stripIcd9CodeFromUrn(icdCode){
    if(!icdCode){return null;}

    var urnStr = 'urn:icd:';
    if(/urn:icd:/.test(icdCode)){
        return icdCode.substring(urnStr.length);
    }

    return(icdCode);
}

function getProblemDodMedcinId(record, terminologyUtils){
    if(record.codes){
        var dodMedcinCodeObject = _.find(record.codes, function(code){
            return (code.system && (code.system.toUpperCase() === terminologyUtils.CODE_SYSTEMS.SYSTEM_DOD_MEDCIN) && code.code);
        });

        if(dodMedcinCodeObject){
            return dodMedcinCodeObject.code;
        }
    }
    return '';
}



module.exports = transformAndEnrichRecord;