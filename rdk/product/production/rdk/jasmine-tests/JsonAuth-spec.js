/*jslint node: true */
'use strict';

var JsonAuth = require('../systems/pep/JsonAuth');
var config = require('../config/mockConfig');

var pepResponseCode = {
    permit: 'Permit',
    breakglass: 'BreakGlass',
    notapplicable: 'NotApplicable',
    indeterminate: 'Indeterminate',
    deny: 'Deny'
};
describe('JsonAuth', function() {
    it('tests that permit is returned on a permit PDP Response', function() {
        var optParams = {
            breakglass: 'true',
            sensitive: 'false',
            hasSSN: 'true',
            requestingOwnRecord: 'false',
            rptTabs: 'true',
            corsTabs: 'true',
            dgRecordAccess: 'true',
            dgSensitiveAccess: 'true'
        };

        var callbackCalled = false;

        var pdpResponse = {
            code: '',
            reason: ''
        };

        var callback = function(err, data) {
            callbackCalled = true;
            pdpResponse = data;
        };

        config.pdpConfig.isTesting = true;

        var jsonAuth = new JsonAuth();

        jsonAuth.getAuth(optParams, callback);

        waitsFor(function() {
            return callbackCalled;
        }, 1000);

        runs(function() {
            expect(pdpResponse.code).toEqual(
                pepResponseCode.permit);
        });
    });

    it('tests that deny is returned on a deny PDP Response', function() {
        var optParams = {
            breakglass: 'true',
            sensitive: 'false',
            hasSSN: 'true',
            requestingOwnRecord: 'true',
            rptTabs: 'true',
            corsTabs: 'true',
            dgRecordAccess: 'false',
            dgSensitiveAccess: 'true'
        };

        var callbackCalled = false;

        var pdpResponse = {
            code: '',
            reason: ''
        };

        var callback = function(err, data) {
            callbackCalled = true;
            pdpResponse = data;
        };

        config.pdpConfig.isTesting = true;

        var jsonAuth = new JsonAuth();

        jsonAuth.getAuth(optParams, callback);

        waitsFor(function() {
            return callbackCalled;
        }, 1000);

        runs(function() {
            expect(pdpResponse.code).toEqual(
                pepResponseCode.deny);
        });
    });

    it('tests that breakglass with btg advice is returned on a deny/btg PDP Response', function() {
        var optParams = {
            breakglass: 'false',
            sensitive: 'true',
            hasSSN: 'true',
            requestingOwnRecord: 'false',
            rptTabs: 'true',
            corsTabs: 'true',
            dgRecordAccess: 'true',
            dgSensitiveAccess: 'false'
        };

        var callbackCalled = false;

        var pdpResponse = {
            code: '',
            reason: ''
        };

        var callback = function(err, data) {
            callbackCalled = true;
            pdpResponse = data;
        };

        config.pdpConfig.isTesting = true;

        var jsonAuth = new JsonAuth();

        jsonAuth.getAuth(optParams, callback);

        waitsFor(function() {
            return callbackCalled;
        }, 1000);

        runs(function() {
            expect(pdpResponse.code).toEqual(
                pepResponseCode.breakglass);
            expect(pdpResponse.reason).toEqual(
                'SensitiveAccessRequired');
        });
    });
});
