'use strict';

var PublisherDummy = require('./publisherDummy.js');

function Router(log, config, jobStatusUpdater, PublisherClass) {
    this.log = log;
    this.config = config;
}

Router.prototype.publish = function(jobs, options, callback) {
    // second parameter is optional
    if (arguments.length === 2) {
        callback = arguments[1];
    }

    return callback(null, '');
};

Router.prototype.getPublisherForJob = function(job) {
    return new PublisherDummy(this.log, this.config, 'dummyJob');
};

module.exports = Router;
