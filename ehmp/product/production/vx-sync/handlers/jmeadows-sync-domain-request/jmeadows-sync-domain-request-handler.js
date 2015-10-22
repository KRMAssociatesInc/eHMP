'use strict';

var _ = require('underscore');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var request = require('request');
var errorUtil = require(global.VX_UTILS + 'error');
var format = require('util').format;
var inspect = require(global.VX_UTILS + 'inspect');
var uuid = require('node-uuid');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('jmeadows-sync-domain-request-handler.handle: Received request to JMeadows (%s) %j', job.dataDomain, job);

    if (!job.patientIdentifier || !job.patientIdentifier.type || job.patientIdentifier.type !== 'pid' || !/^DOD;/.test(job.patientIdentifier.value)) {
        log.error('jmeadows-sync-domain-request-handler.handle: Could not find EDIPI for JMeadows Sync request');
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('jmeadows-sync-domain-request-handler.handle: Expected DOD pid which contains EDIPI as patient id, but it was not found.'));
    }

    var domainConfig = getDomainConfiguration(log, config, job);
    if (domainConfig === null) {
        log.warn('jmeadows-sync-domain-request-handler.handle: No configuration for domain for job: %j', job);
        return setTimeout(handlerCallback, 0, errorUtil.createFatal('jmeadows-sync-domain-request-handler.handle: No configuration for domain'));
    }
    var metricsObj = {'timer':'start','process':uuid.v4(),'pid':job.patientIdentifier.value,'domain':job.dataDomain,'subsystem':'JMeadows','action':'sync domain','jobId':job.jobId,'rootJobId':job.rootJobId,'jpid':job.jpid};
    environment.metrics.debug('JMeadows domain sync',metricsObj);
    metricsObj.timer='stop';

    log.debug('jmeadows-sync-domain-request-handler.handle: sending domain request to Jmeadows for pid: %s; domain: %s; domainConfig: %j.', job.patientIdentifier.value, job.dataDomain, domainConfig);
    request(domainConfig, function(error, response, body) {
        log.debug('jmeadows-sync-domain-request-handler,handle: Received domain response.  error: %s; ', error);
        if ((!error) && (response) && (response.statusCode === 200)) {
            environment.metrics.debug('JMeadows domain sync',metricsObj);
            log.debug('jmeadows-sync-domain-request-handler.handle: response body (string form): %s', body);
            var jsonBody;
            if (typeof body !== 'object') {
                log.debug('jmeadows-sync-domain-request-handler.handle: was a string.  Parsing to object now...');
                try {
                    jsonBody = JSON.parse(body);
                } catch (e) {
                    log.error('jmeadows-sync-domain-request-handler.handle: Failed to parse JSON.  body: %s', body);
                    return handlerCallback(errorUtil.createFatal('Failed to parse JMeadows response.'));
                }
            } else {
                log.debug('jmeadows-sync-domain-request-handler.handle: was an object - no parsing necessary.', body);
                jsonBody = body;
            }
            var jobToPublish = jobUtil.createJmeadowsDomainXformVpr(job.patientIdentifier, job.dataDomain, jsonBody, job.requestStampTime, job);

            environment.publisherRouter.publish(jobToPublish, handlerCallback);
        } else {
            environment.metrics.debug('JMeadows domain sync in Error',metricsObj);
            var statusCode;
            if ((response) && (response.statusCode)) {
                statusCode = response.statusCode;
            }
            log.error(format('jmeadows-sync-domain-request-handler.handle: Unable to retrieve JMeadows sync for %s domain %s because %s', inspect(job.patientIdentifier), job.dataDomain, statusCode));
            return handlerCallback(errorUtil.createFatal('unable to sync'));
        }
    });

}

function getDomainConfiguration(log, config, job) {
    var query = {};
    query.edipi = idUtil.extractDfnFromPid(job.patientIdentifier.value);

    if (!config.jmeadows[job.dataDomain]) {
        log.error('jmeadows-sync-domain-request-handler.getDomainConfiguration: Missing configuration for data domain: ' + job.dataDomain);
        return null;
    }

    var domainConfig = _.extend({
        'qs': query
    }, config.jmeadows[job.dataDomain]);
    domainConfig = _.defaults(domainConfig, config.jmeadows.defaults);
    var url = format('%s://%s:%s%s', domainConfig.protocol || 'http', domainConfig.host, domainConfig.port, domainConfig.path);
    domainConfig.url = url;

    return domainConfig;
}

module.exports = handle;
module.exports._getDomainConfiguration = getDomainConfiguration;