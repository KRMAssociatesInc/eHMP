'use strict';

var cdsintentResource = require('./cds-intent-resource');

describe('CDS Intent Resource', function() {
    var resources = cdsintentResource.getResourceConfig();
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

    it('has correct configuration for CDS Intent get ', function() {
        var r = resources[0];
        expect(r.name).to.equal('CDS-intent-get');
        expect(r.path).to.equal('/registry');
        expect(r.get).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.name).not.to.be.undefined();
        expect(r.parameters.get.scope).not.to.be.undefined();
        expect(r.parameters.get.scopeId).not.to.be.undefined();

    });
    it('has correct configuration for CDS Intent post ', function() {
        var r = resources[1];
        expect(r.name).to.equal('CDS-intent-post');
        expect(r.path).to.equal('/registry');
        expect(r.post).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).to.be.undefined();
    });
    it('has correct configuration for CDS Intent put ', function() {
        var r = resources[2];
        expect(r.name).to.equal('CDS-intent-put');
        expect(r.path).to.equal('/registry');
        expect(r.put).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.put).not.to.be.undefined();
        expect(r.parameters.put.name).not.to.be.undefined();
        expect(r.parameters.put.scope).not.to.be.undefined();
        expect(r.parameters.put.scopeId).not.to.be.undefined();
    });
    it('has correct configuration for CDS Intent delete', function() {
        var r = resources[3];
        expect(r.name).to.equal('CDS-intent-delete');
        expect(r.path).to.equal('/registry');
        expect(r.delete).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.delete).not.to.be.undefined();
        expect(r.parameters.delete.name).not.to.be.undefined();
        expect(r.parameters.delete.scope).not.to.be.undefined();
        expect(r.parameters.delete.scopeId).not.to.be.undefined();
    });
});
