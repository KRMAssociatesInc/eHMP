'use strict';

var patientPhotoResource = require('./patient-photo-resource');

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
        expect(resources.length).to.equal(1);
        expect(resources[0].name).to.equal('getPatientPhoto');
        expect(resources[0].path).to.equal('');
    });

});
