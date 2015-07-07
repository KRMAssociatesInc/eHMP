'use strict';

var _ = require('underscore');
var _s = require('underscore.string');
var async = require('async');

var logUtil = require(global.VX_UTILS + 'log');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
var request = require('request');

var defaultSyncOptions = {
    'protocol': 'http',
    'host': '127.0.0.1',
    'port': 8080,
    'path': '/sync/load',
    'method': 'POST'
};


//---------------------------------------------------------------------------------
// Constructor for this class - This class inherits from events.EventEmitter.
//
// log: The log to use when logging messages.
// vistaId: The site code for the site associated with this poller.
// config: The general configuration information.
// environment: Cross cutting environment handles, etc.
// start: if this coerces to 'true', then the poller will start automatically
//      when the Poller is instantiated.
//----------------------------------------------------------------------------------
var Poller = function(logger, vistaId, config, environment, start) {
    this.vistaId = vistaId;
    this.environment = environment;
    this.logger = logUtil.getAsChild('appointmentTriggerPoller-' + vistaId, logger);
    this.paused = !start;
    this.pollDelayMillis = 1000;
    this.vistaProxy = new VistaClient(logger, config);
};

Poller.prototype.start = function(callback) {
    this.logger.trace('appointment-trigger-poller.start() starting poller');
    this.doNext();
    setTimeout(callback, 0, null, 'success');
};

Poller.prototype.pause = function() {
    this.logger.debug('appointment-trigger-poller.stop() stopping...');
    this.paused = true;
};

Poller.prototype.resume = function() {
    this.logger.debug('appointment-trigger-poller.stop() stopping...');
    this.paused = false;
};

Poller.prototype.getStatus = function() {
    this.logger.debug('vista-record-poller.getStatus()');

    return {
        vista: this.vistaId,
        status: this.paused ? 'paused' : 'running'
    };
};

Poller.prototype.doNext = function() {
    if (this.paused) {
        this.logger.debug('appointment-trigger-poller.doNext() paused == true, SKIPPING Polling for new batch of data from vista [%s]', this.vistaId);
        return poll(this, this.pollDelayMillis);
    }

    this.logger.debug('appointment-trigger-poller.doNext() polling for new batch of data from vista [%s]', this.vistaId);

    var self = this;
    this.vistaProxy.fetchAppointment(this.vistaId, function(error, result) {
        if (error) {
            self.logger.error('appointment-trigger-poller.doNext() Unable to call vista-client.fetchAppointment %j', error);
            return poll(self, self.pollDelayMillis);
        }

        if (_.isEmpty(result)) {
            self.logger.debug('appointment-trigger-poller.doNext() Successfully called, no appointments on %s', self.vistaId);
            return poll(self, self.pollDelayMillis);
        }

        self.logger.debug('appointment-trigger-poller.doNext() Successfully called, received appointments on %s: %s', self.vistaId, result);

        var idParams = constructIdParams(result);
        this.logger.debug('appointment-trigger-poller.doNext() set to sync patients ' + idParams);

        async.each(idParams, initiateSync.bind(null, this.logger, this.config), function(error) {
            if (error) {
                self.logger.error('appointment-trigger-poller.doNext() Unable to call sync endpoint for patients on %s: %j', self.vistaId, error);
                return poll(self, self.pollDelayMillis);
            }

            poll(self);
        });
    });
};


function initiateSync(logger, config, idParam, callback) {
    logger.debug('appointment-trigger-poller.initiateSync() idParam=%s', idParam);

    var options = _.defaults({}, config.appointmentTriggerPoller.patientSync, defaultSyncOptions);

    var requestOptions = {
        url: options.protocol + '://' + options.host + ':' + options.port + options.path + '?' + idParam,
        method: options.method
    };

    request(requestOptions, function(error) {
        callback(error);
    });
}

function constructIdParams(vistaId, rawIds) {
    var tmp;

    var ids = _.map(rawIds, function(rawId) {
        if (rawId.dfn) {
            rawId = _s.trim(rawId.dfn);
            rawId = rawId.split(';');
            tmp = _.last(rawId);
            if (_.isEmpty(tmp)) {
                return null;
            }

            return 'pid=' + vistaId + ';' + tmp;
        }

        if (rawId.icn) {
            return 'icn=' + rawId.icn;
        }

        return null;
    });

    ids = _.without(ids, undefined, null);

    return ids;
}

function poll(instance, pollDelayMillis) {
    // setTimeout(instance.emit.bind(instance, 'next'), pollDelayMillis);
    setTimeout(instance.doNext.bind(instance), pollDelayMillis);
}

module.exports = Poller;
Poller._initiateSync = initiateSync;
Poller._constructIdParams = constructIdParams;