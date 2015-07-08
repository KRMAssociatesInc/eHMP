'use strict';

var patientPhotoResource = require('../resources/patientphoto/patientPhotoResource');

describe('Patient Photo Resource Test', function() {
    var req = {
        audit: {
            dataDomain: 'Patient Photo',
            logCategory: 'PATIENT_PHOTO'
        },
        app: {
            config: {mvi: {protcol: 'http', senderCode: '200EHMP'}}
        }
    };

    var res = {
        sendfile: function() {}
    };

    it('tests that getResourceConfig() is setup correctly for getPatientPhoto', function() {
        var resources = patientPhotoResource.getResourceConfig();
        expect(resources.length).toBe(1);
        expect(resources[0].name).toEqual('getPatientPhoto');
        expect(resources[0].path).toEqual('');
    });

});
