/*jslint node: true */
'use strict';

var userdefinedscreensResource = require('../resources/userdefinedscreens/userdefinedscreensResource');

/*describe('User Defined Screens Save Resource', function() {
    it('tests that getResourceConfig() is setup correctly', function() {
        var resources = userdefinedscreensResource.getResourceConfig();

        expect(resources[0].name).toEqual('');
        expect(resources[0].path).toEqual('');
        expect(resources[0].permissions).toEqual(['save-userdefined-screens']);
        expect(resources[0].permissions).toEqual(['save-userdefined-screens']);
    });
});*/

describe('User Defined Screens Get Resource', function() {
    describe('call function getUserDefinedScreens', function() {
        it('tests that getResourceConfig() is setup correctly', function() {
            var resources = userdefinedscreensResource.getResourceConfig();

            expect(resources[0].name).toEqual('');
            expect(resources[0].path).toEqual('');
            expect(resources[0].permissions).toEqual(['save-userdefined-screens']);
            expect(resources[0].interceptors).toEqual({
                pep: false,
                operationalDataCheck: false
            });
            expect(resources[0].permissions).toEqual(['save-userdefined-screens']);
        });
    });
});
