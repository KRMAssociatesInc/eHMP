'use strict';

var MetricsData = require('./metrics-data');

describe("Metrics data spec", function() {
    it("can create an incoming type without config", function() {
        var metricData = new MetricsData("incoming", null);
        expect(metricData.isType("incoming")).to.be.truthy();
        expect(metricData.path).to.be.undefined();
    });

    it("can create an incoming type with a valid route value", function() {
        var config = {
            'route' : {'path' : "path/path"}
        }

        var metricData = new MetricsData("incoming", config);
        expect(metricData.isType("incoming")).to.be.truthy();
        expect(metricData.path).to.equal("path/path");
    });

    it("can create an outgoing type", function() {
        var metricData = new MetricsData("outgoing", null);
        expect(metricData.isType("outgoing")).to.be.truthy();
    });

    it("can calculate elapsed time", function() {
        var metricData = new MetricsData("outgoing", null);

        expect(metricData.elapsedMilliseconds).to.equal(0);

        metricData.calcElapsedTime();
        expect(metricData.elapsedMilliseconds).to.be.above(0);
    });

    it("can add host data", function() {
        var metricData = new MetricsData("outgoing", null);

        expect(metricData.host).to.equal("UNKNOWN");
        expect(metricData.hostName).to.equal("UNKNOWN");

        metricData.addHost("10.10.0.101", "jds");

        expect(metricData.host.host).to.equal("10.10.0.101");
        expect(metricData.host.name).to.equal("jds");
        expect(metricData.hostName).to.equal("jds");
    });

    it("can set result to success", function() {
        var metricData = new MetricsData("outgoing", null);

        expect(metricData.result).to.equal("undefined");

        metricData.successfulOperation();

        expect(metricData.result).to.equal("success");
    });

    it("can set result to failure", function() {
        var metricData = new MetricsData("outgoing", null);

        expect(metricData.result).to.equal("undefined");

        metricData.failedOperation();

        expect(metricData.result).to.equal("failure");
    });
});
