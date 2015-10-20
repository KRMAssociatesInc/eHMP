'use strict';

var _ = require('lodash');
var now = require('performance-now');

module.exports = MetricsData;

/*
    Performance data saved for all incoming and outgoing http(s) request.  In general, we favor a functional style in rdk
    but in this specific case an object makes sense for holding data.  Private data is protected by functions
    (encapsulation, single place to change).
 */
function MetricsData(type, config) {
    this.type = type;
    this.host ='UNKNOWN';
    this.hostName = 'UNKNOWN';
    this.result = 'undefined';
    this.startDate = new Date().getTime();

    //Note: lodash not working with nested objects
    if(type === 'incoming' && _.has(config, 'route') && _.has(config.route, 'path')) {
        this.path = config.route.path;
    }

    this._deltaStart = now();           //High precision timer used to calc elapsed time
    this.elapsedMilliseconds = 0;
}

MetricsData.prototype.addHost = function(ip, hostName) {
    this.host = {
        host: ip,
        name: hostName
    };
    this.hostName = hostName;
};

MetricsData.prototype.calcElapsedTime = function() {
    this.elapsedMilliseconds = now() - this._deltaStart;
};

MetricsData.prototype.isType = function(type) {
    return this.type === type;
};

MetricsData.prototype.successfulOperation = function() {
    this.result = 'success';
};

MetricsData.prototype.failedOperation = function() {
    this.result = 'failure';
};
