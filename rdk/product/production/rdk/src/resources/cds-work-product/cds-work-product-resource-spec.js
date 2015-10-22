'use strict';

var cdsWorkProductResource = require('./cds-work-product-resource');

describe('CDS Work Product Resource', function () {
    var resources = [];
    beforeEach(function () {
        var res = cdsWorkProductResource.getResourceConfig();
        var i;
        for (i = 0; i < res.length; i += 1) {
            resources[res[i].name] = res[i];
        }
    });

    it('tests that getResourceConfig() is setup correctly for createWorkProduct', function () {
        var res = resources.createWorkProduct;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/product');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for retrieveWorkProduct', function () {
        var res = resources.retrieveWorkProduct;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/product');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for user updateWorkProduct', function () {
        var res = resources.updateWorkProduct;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/product');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for deleteWorkProduct', function () {
        var res = resources.deleteWorkProduct;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/product');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
       });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.delete).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for subscriptions', function () {
        var res = resources.retrieveSubscriptions;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/subscriptions');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for subscriptions', function () {
        var res = resources.updateSubscriptions;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/subscriptions');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for subscriptions', function () {
        var res = resources.deleteSubscriptions;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/subscriptions');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.delete).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for retrieveInbox', function () {
        var res = resources.Inbox;
        expect(res).not.to.be.undefined();
        expect(res.path).to.equal('/inbox');
        expect(res.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(res.healthcheck).not.to.be.undefined();
        expect(res.get).not.to.be.undefined();
    });

});
