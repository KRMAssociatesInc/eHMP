'use strict';

var resource = require('./orders-resources');

describe('write-back orders Resources', function() {
    it('tests that getResourceConfig() is setup correctly for create order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[0].name).to.equal('create');
        expect(resources[0].path).to.equal('');
        expect(resources[0].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[0].permissions).not.to.be.undefined();
        expect(resources[0].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for update order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[1].name).to.equal('update');
        expect(resources[1].path).to.equal('/:resourceId');
        expect(resources[1].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[1].permissions).not.to.be.undefined();
        expect(resources[1].put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for discontinue order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[2].name).to.equal('edit');
        expect(resources[2].path).to.equal('/:resourceId');
        expect(resources[2].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[2].permissions).not.to.be.undefined();
        expect(resources[2].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for discontinue order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(4);

        expect(resources[3].name).to.equal('discontinue');
        expect(resources[3].path).to.equal('/:resourceId');
        expect(resources[3].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[3].permissions).not.to.be.undefined();
        expect(resources[3].delete).not.to.be.undefined();
    });

    it('tests that identifyOrderType returns correct order types', function() {
        var req = {
            body: {
                kind: 'Laboratory'
            },
            logger: {
                info: function(log) {
                    return log;
                }
            }
        };
        var orderType = resource._identifyOrderType(req);
        expect(orderType).to.equal('Laboratory');

        req.body.kind = 'Medication, Outpatient';
        orderType = resource._identifyOrderType(req);
        expect(orderType).to.equal('Medication, Outpatient');

        req.body.kind = 'Lab';
        orderType = resource._identifyOrderType(req);
        expect(orderType).to.equal('Unhandled Order Type');
    });
});
