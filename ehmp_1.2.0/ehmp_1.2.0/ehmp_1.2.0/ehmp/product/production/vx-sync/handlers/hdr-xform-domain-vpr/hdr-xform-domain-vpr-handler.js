'use strict';

var util = require('util');
var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var metastampUtil = require(global.VX_UTILS + 'metastamp-utils');
var moment = require('moment');
var pidUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var OperationaldataSyncUtil = require(global.VX_UTILS + 'site-operational-data-status-util');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('received request to HDR xform (%s) %s', job.dataDomain, job.type);

    if (!jobUtil.isValid(jobUtil.hdrDomainXformVprType(job.dataDomain), job)) {
        log.warn('hdr-xform-domain-vpr-handler.handle: Invalid job received');
        log.warn(job);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid format for job', job));
    }
    if (!job.patientIdentifier || !job.patientIdentifier.type ||
        job.patientIdentifier.type !== 'pid' || !/^HDR;/.test(job.patientIdentifier.value)) {
        log.error('hdr-xform-domain-vpr-handler: expected a HDR job with patientIdentifier type and value');
        return setTimeout(handlerCallback, 0, 'Expected HDR pid which contains icn as patient id, but it was not found.');
    }

    if (_.isUndefined(job.record) || _.isUndefined(job.record.data) || ! _.isArray(job.record.data.items) || job.record.data.items.length < 1 || _.isUndefined(job.record.data.items[0].uid)) {
        log.error('hdr-xform-domain-vpr-handler: expected an HDR job with valid UID');
        return setTimeout(handlerCallback, 0, 'Expected HDR job with a valid UID, but it was not found.');
    }

    var domainCheck = config.hdr.domains;

    if (!_.contains(domainCheck, job.dataDomain)) {
        log.error(util.format('hdr-xform-domain-vpr-handler.handle: domain \'%s\' is not present on valid domain list: %j; config: %j', job.dataDomain, domainCheck, config));
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid domain type'));
    }

    log.debug('hdr-xform-domain-vpr-handler.handle: Transforming data for domain: %s to VPR', job.dataDomain);
    var icn = pidUtil.extractIcnFromPid(job.patientIdentifier.value);

    //lets pass in the list of primary sites so that redundant jobs wont get scheduled at all...
    // var primaryVistaSites = _.isArray(config.vistaSites) ? config.vistaSites : _.keys(config.vistaSites);
    var vprItems = xformItemCollection(log, config, job.record, icn, job.requestStampTime);

    if (_.isEmpty(vprItems)) {
        log.error('hdr-xform-domain-vpr-handler.handle: No valid %s data found for %s icn %s', job.dataDomain, job.patientIdentifier.value, icn);
        return setTimeout(handlerCallback, 0, null, 'NoValidDataFound');
    }

    var record = {
        data: {
            items: vprItems
        }
    };

    log.debug('hdr-xform-domain-vpr-handler.handle: Transformed VPR records: %j and requestStampTime %j', record, job.requestStampTime);
    var domainMetastamp = metastampUtil.metastampDomain(record, job.requestStampTime, null);
    log.debug('hdr-xform-domain-vpr-handler.handle: metastamp created: %j', domainMetastamp);

    environment.jds.saveSyncStatus(domainMetastamp, job.patientIdentifier, function(error, response) {
        log.debug('hdr-xform-domain-vpr-handler.handle: saveSyncStatus returned.  error: %s; response: %j for metastamp: %k', error, response, domainMetastamp);
        if (error) {
            log.error('hdr-xform-domain-vpr-handler.handle: Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', job.patientIdentifier.value, error, response, domainMetastamp);
            error = errorUtil.createTransient('Unable to store metastamp', error);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            return handlerCallback(null, 'FailedJdsError');
        }

        if (!response) {
            log.error('hdr-xform-domain-vpr-handler.handle:  Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', job.patientIdentifier.value, error, response, domainMetastamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return handlerCallback(null, 'FailedJdsNoResponse');
        }

        if (response.statusCode !== 200) {
            log.error('hdr-xform-domain-vpr-handler.handle:  Failed to store metaStamp for pid: %s - incorrect status code returned. Error: %s;  Response: %j; metaStamp:[%j]', job.patientIdentifier.value, error, response, domainMetastamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - incorrect status code returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return handlerCallback(null, 'FailedJdsWrongStatusCode');
        }

        // If we got here... then we the meta-stamp was stored and we are now ready to publish the jobs.
        //-----------------------------------------------------------------------------------------------
        log.debug('hdr-xform-domain-vpr-handler.handle: We are now preparing jobs for publishing.  record: %j', record);
        var jobsToPublish = _.map(record.data.items, function(item) {
            var meta = {
                jpid: job.jpid,
                rootJobId: job.rootJobId,
                param: job.param
            };

            return jobUtil.createRecordEnrichment(job.patientIdentifier, job.dataDomain, item, meta);
        });

        log.debug('hdr-xform-domain-vpr-handler.handle: Jobs prepared.  jobsToPublish: %j', jobsToPublish);
        environment.publisherRouter.publish(jobsToPublish, function(error, response) {
           log.debug('hdr-xform-domain-vpr-handler.handle: Jobs published.  error: %s, response: %j', error, response);
            if (error) {
                log.error('hdr-xform-domain-vpr-handler.handle:  Failed to publish jobs.  error: %s; response: %s; jobs: %j', error, response, jobsToPublish);

                // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                //--------------------------------------------------------------------------------------------------------------------------
                return handlerCallback(null, 'FailedToPublishJobs');
            }

            return handlerCallback(null, 'success');
        });
    });
}

/*
 xformItemCollection
 Filters out items that do not have patient data (those that do not have cdrEventId's)
 Calls domain xform method on the items contained in the job
 Adds stampTime to each transformed item
 Only add jobs that do not pertain to primary sites
 Parameters:
 primaryVistaSites - list of primary sites to use for filtering
 items - an object containing the XML data response in JSON form
 icn - the patient's icn, required by the xform method to generate the uid
 domainXformer - the transformation method that will transform a single item to VPR format
 stampTime - timestamp to assign to each VPR data event - should be the requestStampTime
 Returns:
 An array of VPR objects
 */
function xformItemCollection(log, config, record, icn, stampTime) {
    log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): icn:%s and config is %j', icn, config);
    //Don't proceed if data is null
    if (!record) {
        return;
    }
    var primaryVistaSites = _.isArray(config.vistaSites) ? config.vistaSites : _.keys(config.vistaSites);
    log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): primarySites: %j', primaryVistaSites);

    var retVal = _.map(record.data.items, function(item) {
        var vprItem = item;
        vprItem.pid = 'HDR;' + icn;
        vprItem.stampTime = stampTime;

        var signedDateTime = vprItem.signedDateTime;
        if(signedDateTime && /\//.test(signedDateTime)){
            vprItem.signedDateTime = moment(signedDateTime, 'MM/DD/YY HH:mm').format('YYYYMMDDHHmmss');
        }

        log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): vprItem: %s', vprItem.pid);

        return vprItem;
    });

    var operationaldataSyncUtil = OperationaldataSyncUtil.getInstance();

    retVal = _.filter(retVal, function(item) {
        var siteHash = uidUtil.extractSiteHash(item.uid);
        log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): siteHash', siteHash);

        if (! _.contains(primaryVistaSites, siteHash)) {
            log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): is not contained in primary site%j', primaryVistaSites);
            return true;
        }

        if (! operationaldataSyncUtil.isSynced(log, siteHash))  {
            log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): is not synced %j', siteHash);
            return true;
        }

        log.debug('hdr-xform-domain-vpr-handler.xformItemCollection(): deleting item: %j', item);
        return false;

    });

    return retVal;
}

module.exports = handle;
handle._steps = {
    '_xformItemCollection': xformItemCollection
};
