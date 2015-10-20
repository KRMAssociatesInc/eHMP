'use strict';

var _ = require('underscore');
var async = require('async');
//--------------------------------------------------------------------------------
// This is a record enrichment transformer for lab data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
// This method transfroms and enriches the lab record.
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
	log.debug('record-enrichment-lab-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

    // Make sure we have something to work with.
    //------------------------------------------
    if (!record) {
        log.warn('record-enrichment-lab-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
        return setTimeout(callback, 0, null, null);
    }

    var terminologyUtils = environment.terminologyUtils;
    if(environment.terminologyUtils === undefined) {
        return callback('No terminology utility provided');
    }

    log.debug('record-enrichment-lab-xformer.transformAndEnrichRecord adding missing fields');
    addInMissingFields(record);
    log.debug('record-enrichment-lab-xformer.transformAndEnrichRecord changing data types');
    fixFieldDataTypes(record);
    addTerminologyCodeTranslations(record, log, terminologyUtils, function(error, recordWithTerminologyCodes) {
        log.debug('record-enrichment-lab-xformer.transformAndEnrichRecord: Returning error: %s recordWithTerminologyCodes: %j', error, recordWithTerminologyCodes);
        return callback(error, recordWithTerminologyCodes);
    });

}

function addInMissingFields(record) {

    // record.kind
    //----------------
    record.kind = (record.categoryName === null || record.categoryName === undefined) ? 'Unknown' : record.categoryName;

    // record.abnormal
    //----------------
    record.abnormal = (record.interpretationCode !== undefined && record.interpretationCode !== null);

    // record.micro
    //----------------
    record.micro = (record.categoryCode !== undefined && record.categoryCode !== null && record.categoryCode === 'urn:va:lab-category:MI');

    // record.qualifiedName
    //----------------
    record.qualifiedName = record.typeName;
    if(record.specimen !== undefined && record.specimen !== null) {
        record.qualifiedName += ' (' + record.specimen + ')';
    }

    // record.summary
    //----------------
    record.summary = record.qualifiedName;
    if (record.result !== undefined && record.result !== null) {
        record.summary += ' ' + record.result;
    }
    if (record.interpretationCode !== undefined && record.interpretationCode !== null) {
        record.summary += '<em>' + displayInterpretationCodes[record.interpretationCode] + '</em>';
    }
    if (record.units !== undefined && record.units !== null) {
        record.summary += ' ' + record.units;
    }

}

function addTerminologyCodeTranslations(record, log, terminologyUtils, callback) {
    async.series([function(cb){
        // record.lnccodes
        //----------------
        if(record.lnccodes === undefined || record.lnccodes === null) {
            record.lnccodes = [];
        }
        log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations aggregating lnccodes');
        if(record.vuid !== undefined && record.vuid !== null) {
            log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations pushing vuid lnccode');
            record.lnccodes.push(String(record.vuid));
        }
        if(record.typeCode !== undefined && record.typeCode !== null) {
            log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations pushing typeCode lnccode');
            record.lnccodes.push(record.typeCode);
            terminologyUtils.getVALoincConcept(record.typeCode, function(err, result){
                if(result) {
                    if(result.ancestors) {
                        log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations adding ancestor codes');
                        record.lnccodes = record.lnccodes.concat(result.ancestors);
                    } else {
                        log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations no ancestor codes');
                    }
                } else {
                    log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations error in loinc terminology');
                }
                record.lnccodes = _.uniq(record.lnccodes);
                cb();
            });
        } else {
            log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations no typeCode for loinc lookup');
            // record.lnccodes = _.uniq(record.lnccodes);
            cb();
        }
    }, function(cb){
        // record.codes
        //---------------
        var code = null;
        log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations populating codes');
        var postProcessing = function(err, result) {
            //convert JLV Mapped to JDS Code
            if(result) {
                log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations manipulating code results');
                result = {
                    system: result.codeSystem,
                    code: result.code,
                    display: result.displayText
                };
                if(!record.codes) {
                    record.codes = [];
                }
                if(!result.display) {
                    delete result.display;
                }
                record.codes.push(result);
            }
            cb();
        };
        if(!containsLoinc(record)) {
            if(isDODResult(record)) {
                log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations translating DOD codes');
                code = getLabDodNcid(record);
                terminologyUtils.getJlvMappedCode('LabDODNcidToLOINC', code, postProcessing);
            }
            else /*VA Result*/{
                log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations translating VA codes');
                code = getLoincCode(record);
                terminologyUtils.getJlvMappedCode('LabUseLOINCtoGetText', code, postProcessing);
            }
        } else {
            log.debug('record-enrichment-lab-xformer.addTerminologyCodeTranslations record contains loinc');
            cb();
        }
    }], function(err){
        if(err) {
            log.error(err);
        }
        callback(err, record);
    });
}

function containsLoinc(record) {
    if(record.codes !== undefined && record.codes !== null) {
        var found = _.find(record.codes, function(value) {
            if(value.system !== undefined && value.system !== null && value.system === 'http://loinc.org') {
                return true;
            }
        });
        return (found !== undefined);
    }
    return false;
}

function getLabDodNcid(record) {
    if(record.codes !== undefined && record.codes !== null) {
        var index = _.indexOf(record.codes, function(item){
            return (item.system !== undefined && /dod_ncid/i.test(item.system) && item.code !== undefined && item.code !== null);
        });
        if(index >= 0) {
            return record.codes[index].code;
        }
    }
    return '';
}

function getLoincCode(record) {
    var lncPattern = /^urn:lnc:(.*)/;
    var match  = null;
    if(record.typeCode !== undefined && record.typeCode !== null && lncPattern.test(record.typeCode)) {
        match = lncPattern.exec(record.typeCode);
        return match[1];
    } else if(record.lnccodes !== undefined && record.lnccodes !== null) {
        var index = _.indexOf(record.lnccodes, function(item){return lncPattern.test(item);});
        if(index >= 0) {
            match = lncPattern.exec(record.lnccodes[index]);
            return match[1];
        }
    }
    return '';
}

function isDODResult(record) {
    if(record.uid !== undefined && record.uid !== null) {
        return record.uid.match(/:DOD:/);
    }
    return false;
}


function fixFieldDataTypes(record) {

    if ((record.result !== null) && (record.result !== undefined) && (!_.isString(record.result))) {
        record.result = String(record.result);
    }
    if ((record.resulted !== null) && (record.resulted !== undefined) && (!_.isString(record.resulted))) {
        record.resulted = String(record.resulted);
    }
    if ((record.result !== null) && (record.resultNumber === undefined) && (_.isString(record.result))) {
        record.resultNumber = Number(record.result);
    }
    if ((record.facilityCode !== null) && (record.facilityCode !== undefined) && (!_.isString(record.facilityCode))) {
        record.facilityCode = String(record.facilityCode);
    }
    if ((record.high !== null) && (record.high !== undefined) && (!_.isString(record.high))) {
        record.high = String(record.high);
    }
    if ((record.low !== null) && (record.low !== undefined) && (!_.isString(record.low))) {
        record.low = String(record.low);
    }
    if ((record.observed !== null) && (record.observed !== undefined) && (!_.isString(record.observed))) {
        record.observed = String(record.observed);
    }
    if ((record.orderId !== null) && (record.orderId !== undefined) && (!_.isString(record.orderId))) {
        record.orderId = String(record.orderId);
    }
    if ((record.lastUpdateTime !== null) && (record.lastUpdateTime !== undefined) && (!_.isString(record.lastUpdateTime))) {
        record.lastUpdateTime = String(record.lastUpdateTime);
    }
    if ((record.stampTime !== null) && (record.stampTime !== undefined) && (!_.isString(record.stampTime))) {
        record.stampTime = String(record.stampTime);
    }
}

var displayInterpretationCodes = {
    'urn:hl7:observation-interpretation:LL': 'L*',
    'urn:hl7:observation-interpretation:L': 'L',
    'urn:hl7:observation-interpretation:H': 'H',
    'urn:hl7:observation-interpretation:HH': 'H*'
};

module.exports = transformAndEnrichRecord;