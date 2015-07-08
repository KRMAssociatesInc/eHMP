'use strict';

module.exports = function(environment, log) {
    function LogJobHandler(environment, log) {
        var self = this;
        self.log = log;
    }

    LogJobHandler.prototype.work = function(payload, callback) {
        var self = this;
        self.log.info('handler received payload: ', payload);
        callback('success');
    };

    return new LogJobHandler(environment, log);
};