'use strict';


var Publisher = function(log, config, jobType) {
};


Publisher.prototype.connect = function(connectCallback) {
    return connectCallback(null, '');
};

/*
 options = {
    priority: number,
    delay: seconds,
    ttr: seconds
 }
 */
Publisher.prototype.publish = function(job, options, jobStatusUpdater, publishCallback) {
    return publishCallback(null, '');
};

Publisher.prototype.emitInfo = function(message) {
};

Publisher.prototype.emitError = function(err) {
};

Publisher.prototype.emitConnect = function() {
};

Publisher.prototype.emitClose = function() {
};

Publisher.prototype.emitJobPublished = function(jobId, publishingconfig, publishedJob) {
};

Publisher.prototype.emitJobPublishError = function(err, publishingconfig, publishedJob) {
};

module.exports = Publisher;