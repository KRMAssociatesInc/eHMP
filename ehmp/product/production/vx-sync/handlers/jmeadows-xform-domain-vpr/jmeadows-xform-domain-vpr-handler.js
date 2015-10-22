'use strict';

var _ = require('underscore');
var errorUtil = require(global.VX_UTILS + 'error');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var uidUtil = require(global.VX_UTILS + 'uid-utils');
var util = require('util');
var metastampUtil = require(global.VX_UTILS + 'metastamp-utils');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var async = require('async');
var mapUtil = require(global.VX_UTILS + 'map-utils');

//Stores the transform modules for each domain
var xformer = {};

function handle(log, config, environment, job, handlerCallback) {
    log.debug('received request to JMeadows xform (%s) %j', job.dataDomain, job);

    if (!jobUtil.isValid(jobUtil.jmeadowsDomainXformVprType(job.dataDomain), job)) {
        log.warn('jmeadows-xform-domain-vpr-handler.handle: Invalid job received');
        log.warn(job);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid format for job', job));
        //return handlerCallback(errorUtil.createFatal('Invalid format for job', job));
    }

    if (!job.patientIdentifier || !job.patientIdentifier.type || job.patientIdentifier.type !== 'pid' || !/^DOD;/.test(job.patientIdentifier.value)) {
        log.error('jmeadows-xform-domain-vpr-handler: expected job to contain edipi');
        return setTimeout(handlerCallback, 0, 'Expected DOD pid which contains EDIPI as patient id, but it was not found.');
        //handlerCallback('Expected EDIPI, but it was not found.');
    }

    var domainCheck = config.jmeadows.domains;

    if (!_.contains(domainCheck, job.dataDomain)) {
        log.error(util.format('jmeadows-xform-domain-vpr-handler.handle: domain \'%s\' is not present on valid domain list: %j; config: %j', job.dataDomain, domainCheck, config));
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid domain type'));
        //return handlerCallback(errorUtil.createFatal('Invalid domain type'));
    }

    //Load the transformer for the given domain
    if (!xformer[job.dataDomain]) {
        try {
            xformer[job.dataDomain] = require(util.format('./jmeadows-%s-xformer', job.dataDomain));
        } catch (exception) {
            //Cannot find module for dataDomain
            return setTimeout(handlerCallback, 0, errorUtil.createFatal('Invalid domain type'));
            //return handlerCallback(errorUtil.createFatal('Invalid domain type'));
        }
    }


    var patientDemographicsIcn = null;

    async.series([
        function(finishGetIcnForDemographics) {
            if (job.dataDomain === 'demographics') {
                getDemographicsIcnFromJds(job.patientIdentifier.value, log, environment.jds, function(error, response) {
                    // if(error){
                    //     //do something
                    // }
                    if (response) {
                        patientDemographicsIcn = response;
                    }
                    finishGetIcnForDemographics();
                });
            } else {
                finishGetIcnForDemographics();
            }
        },
        function(finishHandler) {
            log.debug('jmeadows-xform-domain-vpr-handler.handle: Transforming data for domain: %s to VPR', job.dataDomain);
            var edipi = idUtil.extractDfnFromPid(job.patientIdentifier.value);
            var vprItems = xformItemCollection(log, job.dataDomain, job.record, edipi, xformer[job.dataDomain], job.requestStampTime, patientDemographicsIcn);

            if (_.isEmpty(vprItems)) {
                log.debug('jmeadows-xform-domain-vpr-handler.handle: No valid %s data found for %s', job.dataDomain, job.patientIdentifier.value);
                return setTimeout(handlerCallback, 0, null, 'NoValidDataFound');
            }

            var record = {
                data: {
                    items: vprItems
                }
            };

            log.debug('jmeadows-xform-domain-vpr-handler.handle: Transformed VPR records: %j', record);
            var domainMetastamp = metastampUtil.metastampDomain(record, job.requestStampTime, null);
            log.debug('jmeadows-xform-domain-vpr-handler.handle: metastamp created: %j', domainMetastamp);

            environment.jds.saveSyncStatus(domainMetastamp, job.patientIdentifier, function(error, response) {
                log.debug('jmeadows-xform-domain-vpr-handler.handle: saveSyncStatus returned.  error: %s; response: %j', error, response);
                if (error) {
                    log.error('jmeadows-xform-domain-vpr-handler.handle: Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', job.patientIdentifier.value, error, response, domainMetastamp);
                    error = errorUtil.createTransient('Unable to store metastamp', error);

                    // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                    //--------------------------------------------------------------------------------------------------------------------------
                    return handlerCallback(null, 'FailedJdsError');
                }

                if (!response) {
                    log.error('jmeadows-xform-domain-vpr-handler.handle:  Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', job.patientIdentifier.value, error, response, domainMetastamp);

                    // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                    //--------------------------------------------------------------------------------------------------------------------------
                    // return callback(util.format('Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

                    return handlerCallback(null, 'FailedJdsNoResponse');
                }

                if (response.statusCode !== 200) {
                    log.error('jmeadows-xform-domain-vpr-handler.handle:  Failed to store metaStamp for pid: %s - incorrect status code returned. Error: %s;  Response: %j; metaStamp:[%j]', job.patientIdentifier.value, error, response, domainMetastamp);

                    // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                    //--------------------------------------------------------------------------------------------------------------------------
                    // return callback(util.format('Failed to store metaStamp for pid: %s - incorrect status code returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

                    return handlerCallback(null, 'FailedJdsWrongStatusCode');
                }

                // If we got here... then we the meta-stamp was stored and we are now ready to publish the jobs.
                //-----------------------------------------------------------------------------------------------
                log.debug('jmeadows-xform-domain-vpr-handler.handle: We are now preparing jobs for publishing.  record: %j', record);
                var jobsToPublish = _.map(record.data.items, function(item) {
                    var meta = {
                        jpid: job.jpid,
                        rootJobId: job.rootJobId,
                        param: job.param
                    };
                    if (_.contains(['consult', 'progressNote', 'dischargeSummary'], job.dataDomain) ) {
                        if(item.dodComplexNoteUri) {
                        return jobUtil.createJmeadowsDocumentRetrievalRequest(job.patientIdentifier, 'document', item, meta);
                        } else {
                        return jobUtil.createJmeadowsCdaDocumentConversion(job.patientIdentifier, 'document', item, meta);
                        }
                    } else {
                        // Get correct VPR domain
                        //-----------------------
                        var vprDataDomain = uidUtil.extractDomainFromUID(item.uid);

                        return jobUtil.createRecordEnrichment(job.patientIdentifier, vprDataDomain, item, meta);
                    }
                });

                log.debug('jmeadows-xform-domain-vpr-handler.handle: Jobs prepared.  jobsToPublish: %j', jobsToPublish);
                environment.publisherRouter.publish(jobsToPublish, function(error, response) {
                    log.debug('jmeadows-xform-domain-vpr-handler.handle: Jobs published.  error: %s, response: %j', error, response);
                    if (error) {
                        log.error('jmeadows-xform-domain-vpr-handler.handle:  Failed to publish jobs.  error: %s; response: %s; jobs: %j', error, response, jobsToPublish);

                        // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                        //--------------------------------------------------------------------------------------------------------------------------
                        return handlerCallback(null, 'FailedToPublishJobs');
                    }

                    return handlerCallback(null, 'success');
                });
            });

            finishHandler();
        }

    ]);

}

/*
    xformItemCollection
    Filters out items that do not have patient data (those that do not have cdrEventId's)
    Calls domain xform method on the items contained in the job
    Adds stampTime to each transformed item

    Parameters:
    items - an object containing the XML data response in JSON form
    edipi - the patient's edipi, required by the xform method to generate the uid
    domainXformer - the transformation method that will transform a single item to VPR format
    stampTime - timestamp to assign to each VPR data event - should be the requestStampTime
    Returns:
    An array of VPR objects
*/

var xformItemCollection = function(log, domain, items, edipi, domainXformer, stampTime, patientDemographicsIcn) {
    //Don't proceed if data is null
    if (!items) {
        return;
    }

    //Exclude null items and anything that does not have a cdrEventId (such as DOD Adaptor status message)
    var filteredItems = _.reject(items, function(item) {
        return (!item || !item.cdrEventId);
    });

    return _.flatten(mapUtil.filteredMap(filteredItems, function(item) {
        var vprItem = domainXformer(item, edipi, patientDemographicsIcn);
        if(vprItem !== null) {
            if(_.isArray(vprItem)) {
                _.each(vprItem, function(item){
                    item.stampTime = stampTime;
                });
            } else {
                vprItem.stampTime = stampTime;
            }
        } else {
            log.error('jmeadows-xform-domain-vpr-handler.xformItemCollection() pid: %s; domain: %s; could not transform record: %j', edipi, domain, item);
        }
        return vprItem;
    }, [null]));
};

var getDemographicsIcnFromJds = function(pid, log, jdsClient, callback) {
    var icn;
    jdsClient.getPatientIdentifierByPid(pid, function(error, response, result) {
        log.debug('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds: querying JDS for icn for pid ' + pid);
        if (error) {
            log.error('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds:  Received error while retrieving patient identifiers for pid: %s; error: %s; response: %j', pid, error, response);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            //return callback(util.format('Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback('FailedJdsError', null);
        }

        if (!response) {
            log.error('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds:  Failed to retrieve patient identifiers for pid: %s; error: %s; response: %j', pid, error, response);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback('FailedJdsNoResponse', null);
        }

        if (response.statusCode !== 200) {
            log.error('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds:  Failed to retrieve patient identifiers for pid: %s - incorrect status code returned. Error: %s;  Response: %j', pid, error, response);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - incorrect status code returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback('FailedJdsWrongStatusCode', null);
        }

        if ((!result) || (!result.jpid)) {
            log.error('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds:  Result for pid: %s did not contain jpid.  Result: %j', pid, error, result);
            return callback('FailedNoJpidInResult', null);
        }

        //console.log(result.patientIdentifiers);
        //console.log(idUtil.extractIdsOfTypes(result.patientIdentifiers, 'icn'));

        _.each(result.patientIdentifiers, function(identifier) {
            if (idUtil.isIcn(identifier)) {
                icn = identifier;
            }
        });

        if (!icn) {
            log.debug('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds:  No icn found for pid ' + pid);
            return callback('NoIcnFound', null);
        } else {
            log.debug('jmeadows-xform-domain-vpr-handler.getDemographicsIcnFromJds:  Found icn ' + icn + ' for pid ' + pid);
            return callback(null, icn);
        }
    });
};

module.exports = handle;
handle._steps = {
    '_xformItemCollection': xformItemCollection,
    '_getDemographicsIcnFromJds': getDemographicsIcnFromJds
};