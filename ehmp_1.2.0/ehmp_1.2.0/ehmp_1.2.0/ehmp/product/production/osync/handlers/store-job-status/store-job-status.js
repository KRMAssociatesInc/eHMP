'use strict';

var _ = require('lodash');
var async = require('async');
var S = require('string');
var moment = require('moment');

require('../../env-setup');
var errorUtil = require(global.OSYNC_UTILS + 'error');
var jobUtil = require(global.OSYNC_UTILS + 'job-utils');
var jdsUtil = require(global.OSYNC_UTILS + 'jds-utils');

function handle(log, config, environment, job, handlerCallback) {
    log.debug('store-job-status.handle : received request to save %s', job);
    var result = true;
    var key = "osyncstatus";

    if (_.isNull(job.type || _.isUndefined(job.type)) ) {
        log.error('store-job-status.handle: Could not find job type');
        handlerCallback('store-job-status.handle: Could not find job type');
        return;
    }
    else if (job.type !== 'store-job-status') {
        log.error('store-job-status.handle: job type was not store-job-status');
        handlerCallback('store-job-status.handle: job type was not store-job-status');
        return;
    }

    // Get current status
    async.series({
        get: function (cb) {
            jdsUtil.getFromJDS(log, config, key, cb);
        }
    }, function(getError, getResponse) {
        var saveList = [];
        var current = getResponse.get.body;

        if (getResponse.get.statusCode === 200) {
            if (!_.isUndefined(current.patients)) {
                saveList.push(current.patients);
            }
        }
        // Append the new status'
        var source = job.source;
        _.forEach(job.patients, function (patient) {
            var saving = {"patient": patient, "source": source, "syncDate": moment().format()};
            saveList.push(saving);
        });
        saveList = _.uniq(saveList, function(item){
            return item.patient;
        });
        async.series({
            save: function (cb) {
                var tosave = {"patients": saveList};
                jdsUtil.saveToJDS(log, config, key, tosave, cb);
            }
        }, function(saveError, saveResponse){
            if (saveResponse.save.statusCode === 200) {
                log.debug("store-job-status.handle: Saved job status in JDS + %s", saveResponse);
            }
            else {
                log.debug("store-job-status.handle: Failed to save job status in JDS");
                result = false;
            }
            handlerCallback(result);
        });
    });
}

module.exports = handle;
