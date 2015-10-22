'use strict';

var userdefinedscreensResource = require('./user-defined-screens-resource');

/*describe('User Defined Screens Save Resource', function() {
    it('tests that getResourceConfig() is setup correctly', function() {
        var resources = userdefinedscreensResource.getResourceConfig();

        expect(resources[0].name).to.equal('');
        expect(resources[0].path).to.equal('');
        expect(resources[0].permissions).to.eql(['save-userdefined-screens']);
        expect(resources[0].permissions).to.eql(['save-userdefined-screens']);
    });
});*/

describe('User Defined Screens Get Resource', function() {
    describe('call function getUserDefinedScreens', function() {
        it('tests that getResourceConfig() is setup correctly', function() {
            var resources = userdefinedscreensResource.getResourceConfig();

            expect(resources[0].name).to.equal('');
            expect(resources[0].path).to.equal('');
            expect(resources[0].permissions).to.eql(['save-userdefined-screens']);
            expect(resources[0].interceptors).to.eql({
                pep: false,
                operationalDataCheck: false,
                synchronize: false
            });
            expect(resources[0].permissions).to.eql(['save-userdefined-screens']);
        });
    });

    it('correctly creates screen ID from session', function() {
        var req = {
            session: {
                user: {
                    site: 'ABCD',
                    duz: {
                        'ABCD': '123456789'
                    }
                }
            }
        };
        var id = 'Test_ScreenId';
        var screenId = userdefinedscreensResource.createScreenIdFromRequest(req, id);

        expect(screenId).to.equal('ABCD;123456789_Test_ScreenId');
    });
});
