'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
//var jobUtil = require(global.VX_UTILS + 'job-utils');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var xformerPtSelectRecEnrichment = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-ptselect-xformer');
var xformerLocationRecEnrichment = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-location-xformer');


function handle(log, config, environment, job, handlerCallback) {
	log.debug('operational-data-store-request-handler.handle : received request to operational data %j', job);

	// if(!jobUtil.isValid(jobUtil.operationalDataStoreType, job)) {
	//     log.warn('Invalid job received');
	//     log.warn(job);
	//     return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
	// }

    if (!job) {
        handlerCallback(errorUtil.createFatal('Job was not valid.'));
    }
    // validate record
    if (_.isUndefined(job.record)) {
        log.error('store-record-request-handler.handle: Missing record.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing record', job));
    }
    if (_.isUndefined(job.record.uid)) {
        log.error('store-record-request-handler.handle: Missing uid.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing UID', job));
    }
    if (_.isUndefined(job.record.stampTime)) {
        log.error('store-record-request-handler.handle: Missing stampTime.  Job: %j', job);
        return handlerCallback(errorUtil.createFatal('Missing stampTime', job));
    }

    // Record enrichment if this is a pt-select record.
    //-------------------------------------------------
    var domain = uidUtil.extractDomainFromUID(job.record.uid);
    if (domain === 'pt-select') {
    	xformerPtSelectRecEnrichment.transformAndEnrichRecordAPI(job.record);
    } else if (domain === 'location') {
        xformerLocationRecEnrichment.transformAndEnrichRecordAPI(job.record);
    }

	if (job) {
		environment.jds.storeOperationalData(job.record, function(error, result, response) {
			if (error) {
				return handlerCallback(errorUtil.createFatal('Unable to handle data store request', error));
			}
            if (result.statusCode !== 201) {
                return handlerCallback(errorUtil.createFatal('Error status storing operational data:', response.error));
            }
			handlerCallback(null, 'success');
		});
	}

}

module.exports = handle;