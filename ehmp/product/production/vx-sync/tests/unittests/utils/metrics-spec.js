'use strict';

require('../../../env-setup');

var Metrics = require(global.VX_UTILS + 'metrics');

describe('metrics.js', function(){
    it('format record PID', function(){
        var message = Metrics.prototype._formatRecord.apply({},[{'pid':'9E7A;3'}]);
        expect(message.pid).toBeDefined();
        expect(message.site).toBeDefined();
    });
    it('format record UID', function(){
        var message = Metrics.prototype._formatRecord.apply({},[{'uid':'urn:va:allergy:ABCD:16:106'}]);
        expect(message.pid).toBeDefined();
        expect(message.site).toBeDefined();
        expect(message.domain).toBeDefined();
        expect(message.uid).toBeDefined();
    });
});