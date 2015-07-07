/*jslint node: true */
'use strict';

var udas = require('../resources/userdefinedscreens/userdefinedsortResource');

describe('User Defined Applet Tile Sort', function() {
    it('tests that getResourceConfig() is setup correctly for applet tile sort', function() {
        var resources = udas.getResourceConfig();

        expect(resources[0].name).toEqual('');
        expect(resources[0].path).toEqual('');
        expect(resources[0].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();

        expect(resources[1].name).toEqual('');
        expect(resources[1].path).toEqual('');
        expect(resources[1].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[1].healthcheck).toBeDefined();
        expect(resources[1].parameters).toBeDefined();
        expect(resources[1].post).toBeDefined();

        expect(resources[2].name).toEqual('');
        expect(resources[2].path).toEqual('');
        expect(resources[2].interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(resources[2].healthcheck).toBeDefined();
        expect(resources[2].parameters).toBeDefined();
        expect(resources[2].delete).toBeDefined();
    });

    it('correctly creates tile sort ID from session', function() {
        var req = {
            session: {
                user: {
                    site: '0D4S',
                    duz: {
                        '0D4S': '98712378133'
                    }
                }
            },
            param: function(id) {
                if (id === 'id') {
                    return 'TestWorkspace1';
                }
                return null;
            }
        };

        var sortId = udas.createSortId(req);

        expect(sortId).toEqual('0D4S;98712378133_TestWorkspace1_sort');
    });

    it('correctly creates tile sort data when none exists for an applet', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        //'orderAfter':'PENICILLIN',
                        fieldValue:'CHOCOLATE'
                    };
        var data = {};

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData._id).toEqual(sortId);
        expect(retData.applets).toBeDefined();
        expect(retData.applets.length).toEqual(1);
        expect(retData.applets[0].instanceId).toEqual(input.instanceId);
        expect(retData.applets[0].keyField).toEqual(input.keyField);
        expect(retData.applets[0].orderSequence).toBeDefined();
        expect(retData.applets[0].orderSequence.length).toEqual(1);
        expect(retData.applets[0].orderSequence[0]).toEqual(input.fieldValue);
    });

    it('correctly creates tile sort data when none exists for an applet(orderAfter item is given in input)', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        orderAfter:'PENICILLIN',
                        fieldValue:'CHOCOLATE'
                    };
        var data = {};

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData._id).toEqual(sortId);
        expect(retData.applets).toBeDefined();
        expect(retData.applets.length).toEqual(1);
        expect(retData.applets[0].instanceId).toEqual(input.instanceId);
        expect(retData.applets[0].keyField).toEqual(input.keyField);
        expect(retData.applets[0].orderSequence).toBeDefined();
        expect(retData.applets[0].orderSequence.length).toEqual(1);
        expect(retData.applets[0].orderSequence[0]).toEqual(input.fieldValue);
    });

    it('correctly creates tile sort data when sorting already exists for an applet', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        fieldValue:'CHOCOLATE'
                    };

        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_sort',
            applets: [{
                instanceId: 'dd479613eb0a',
                keyField:'summary',
                orderSequence: ['PENICILLIN']
            }]
        };

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData._id).toEqual(sortId);
        expect(retData.applets).toBeDefined();
        expect(retData.applets.length).toEqual(1);
        expect(retData.applets[0].instanceId).toEqual(input.instanceId);
        expect(retData.applets[0].keyField).toEqual(input.keyField);
        expect(retData.applets[0].orderSequence).toBeDefined();
        expect(retData.applets[0].orderSequence.length).toEqual(2);
        expect(retData.applets[0].orderSequence[0]).toEqual(input.fieldValue);
    });

    it('correctly creates tile sort data when sorting already exists for an applet(orderAfter item is given in input)', function() {
        var sortId = '0D4S;98712378133_TestWorkspace1_sort';
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        orderAfter:'PENICILLIN',
                        fieldValue:'CHOCOLATE'
                    };

        var data = {
            _id: '0D4S;98712378133_TestWorkspace1_sort',
            applets: [{
                instanceId: 'dd479613eb0a',
                keyField:'summary',
                orderSequence: ['PENICILLIN']
            }]
        };

        var retData = udas._processDataForCreate(sortId, input, data);

        expect(retData._id).toEqual(sortId);
        expect(retData.applets).toBeDefined();
        expect(retData.applets.length).toEqual(1);
        expect(retData.applets[0].instanceId).toEqual(input.instanceId);
        expect(retData.applets[0].keyField).toEqual(input.keyField);
        expect(retData.applets[0].orderSequence).toBeDefined();
        expect(retData.applets[0].orderSequence.length).toEqual(2);
        expect(retData.applets[0].orderSequence[1]).toEqual(input.fieldValue);
    });

    it('correctly validates input when empty object is given', function() {
        var input = {};

        var retData = udas._verifyInput(input);

        expect(retData.valid).toBeFalsy();
        expect(retData.errMsg).toBeDefined();
        expect(retData.errMsg).toMatch('instanceId');
        expect(retData.errMsg).toMatch('keyField');
        expect(retData.errMsg).toMatch('fieldValue');
    });

    it('correctly validates input when partial data is given', function() {
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary'
                    };

        var retData = udas._verifyInput(input);

        expect(retData.valid).toBeFalsy();
        expect(retData.errMsg).toEqual('fieldValue is required.\n');
    });

    it('correctly validates input when valid object is given', function() {
        var input = {
                        instanceId:'dd479613eb0a',
                        keyField:'summary',
                        fieldValue:'CHOCOLATE'
                    };

        var retData = udas._verifyInput(input);

        expect(retData.valid).toBeTruthy();
        expect(retData.errMsg).toEqual('');
    });

});
