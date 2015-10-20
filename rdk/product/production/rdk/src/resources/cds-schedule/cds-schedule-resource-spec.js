'use strict';

var cdsscheduleResource = require('./cds-schedule-resource');

describe('CDS Schedule Resource', function() {
    var resources = cdsscheduleResource.getResourceConfig();
    var interceptors = {
        audit: true,
        metrics: true,
        authentication: true,
        operationalDataCheck: false,
        pep: false,
        synchronize: false
    };

    it('has 4 endpoints configured', function() {
        expect(resources.length).to.equal(4);
    });

    it('has correct configuration for CDS Schedule get ', function() {
        var r = resources[0];
        expect(r.name).to.equal('CDS-schedule-get');
        expect(r.path).to.equal('/job');
        expect(r.get).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.id).not.to.be.undefined();
        expect(r.parameters.get.name).not.to.be.undefined();
    });
    it('has correct configuration for CDS Schedule post ', function() {
        var r = resources[1];
        expect(r.name).to.equal('CDS-schedule-post');
        expect(r.path).to.equal('/job');
        expect(r.post).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).to.be.undefined();
    });
    it('has correct configuration for CDS Schedule put ', function() {
        var r = resources[2];
        expect(r.name).to.equal('CDS-schedule-put');
        expect(r.path).to.equal('/job');
        expect(r.put).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.put).not.to.be.undefined();
        expect(r.parameters.put.id).not.to.be.undefined();
        expect(r.parameters.put.name).not.to.be.undefined();
    });
    it('has correct configuration for CDS Schedule delete', function() {
        var r = resources[3];
        expect(r.name).to.equal('CDS-schedule-delete');
        expect(r.path).to.equal('/job');
        expect(r.delete).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.delete).not.to.be.undefined();
        expect(r.parameters.delete.id).not.to.be.undefined();
    });

});
