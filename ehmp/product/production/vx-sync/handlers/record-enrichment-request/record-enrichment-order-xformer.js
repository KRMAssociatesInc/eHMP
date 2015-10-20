'use strict';

var _ = require('underscore');
var ncUtil = require(global.VX_UTILS + 'namecase-utils');

//--------------------------------------------------------------------------------
// This is a record enrichment transformer for order data.
//
// @Author:  Les Westberg
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
// This method transfroms and enriches the order record.
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
	log.debug('record-enrichment-order-xformer.transformAndEnrichRecord: Entered method.  record: %j', record);

	// Make sure we have something to work with.
    //------------------------------------------
    if (!record) {
        log.warn('record-enrichment-order-xformer.transformAndEnrichRecord: Job either did not exist or did not contain a record.  record: %j', record);
        return setTimeout(callback, 0, null, null);
    }

    log.debug('record-enrichment-order-xformer.transformAndEnrichRecord adding missing fields');
    addInMissingFields(record);
    log.debug('record-enrichment-order-xformer.transformAndEnrichRecord changing data types');
    fixFieldDataTypes(record);

	return callback(null, record);

}

function fixFieldDataTypes(record) {

    if ((record.facilityCode !== null) && (record.facilityCode !== undefined) && (!_.isString(record.facilityCode))) {
        record.facilityCode = String(record.facilityCode);
    }
    if ((record.start !== null) && (record.start !== undefined) && (!_.isString(record.start))) {
        record.start = String(record.start);
    }
    if ((record.stop !== null) && (record.stop !== undefined) && (!_.isString(record.stop))) {
        record.stop = String(record.stop);
    }
    if ((record.localId !== null) && (record.localId !== undefined) && (!_.isString(record.localId))) {
        record.localId = String(record.localId);
    }
    if ((record.entered !== null) && (record.entered !== undefined) && (!_.isString(record.entered))) {
        record.entered = String(record.entered);
    }
    if ((record.lastUpdateTime !== null) && (record.lastUpdateTime !== undefined) && (!_.isString(record.lastUpdateTime))) {
        record.lastUpdateTime = String(record.lastUpdateTime);
    }
    if ((record.stampTime !== null) && (record.stampTime !== undefined) && (!_.isString(record.stampTime))) {
        record.stampTime = String(record.stampTime);
    }
}

function addInMissingFields(record) {

    // record.kind
    //----------------
    if(ServiceCode[record.service]) {
        record.kind = ServiceCode[record.service];
    }

    // record.providerDisplayName
    //----------------
    if (record.providerName) {
        record.providerDisplayName = ncUtil.namecase(record.providerName);
    }

    // record.summary
    //----------------
    if(record.content) {
        record.summary = record.content;
    }
}

var ServiceCode = {
    'PSJ' : 'Medication, Inpatient',
    'PSO' : 'Medication, Outpatient',
    'PSH' : 'Medication, Non-VA',
    'PSIV' : 'Medication, Infusion',
    'PSG' : 'Medication, Inpatient',
    'GMRA' : 'Allergy/Adverse Reaction',
    'GMRC' : 'Consult',
    'RA' : 'Radiology',
    'FH' : 'Dietetics Order',
    'LR' : 'Laboratory',
    'OR' : 'Nursing Order',
    'VBEC' : 'Blood Bank Order',
    'ZZRV' : 'ZZVITALS Order'
};

module.exports = transformAndEnrichRecord;