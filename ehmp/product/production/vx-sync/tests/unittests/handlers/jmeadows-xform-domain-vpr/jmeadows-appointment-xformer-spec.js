'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-appointment-xformer');

describe('jmeadows-appointment-xformer', function() {
    var mockEdipi = '00000099';

    var sampleDODAppointment = {
      'cdrEventId' : '1000010344',
      'codes' : [ ],
      'patientId' : null,
      'patientName' : null,
      'site' : {
        'agency' : 'DOD',
        'dmisId' : null,
        'endpoints' : [ ],
        'id' : null,
        'moniker' : 'NH Great Lakes IL',
        'name' : 'AHLTA',
        'permissions' : [ ],
        'region' : null,
        'siteCode' : '2.16.840.1.113883.3.42.126.100001.13',
        'status' : null
      },
      'sourceProtocol' : 'DODADAPTER',
      'apptDate' : 1389279600000,
      'apptId' : null,
      'apptType' : 'ACUT',
      'clinic' : 'Family Practice Clinic',
      'clinicId' : '',
      'clinicStopCode' : null,
      'clinicStopName' : null,
      'patientClass' : null,
      'providerClass' : '',
      'providerCode' : null,
      'provider' : {
        'name' : 'BHIE, USERONE'
      },
      'providerPager' : '',
      'providerPhone' : '',
      'reason' : '',
      'serviceCategoryCode' : null,
      'serviceCategoryName' : null,
      'status' : 'KEPT',
      'userIen' : '',
      'visitString' : null
    };

    var sampleVPRAppointment = {
        dateTime: '20140109100000',
        categoryName: 'DoD Appointment',
        locationName: 'Family Practice Clinic',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        appointmentStatus: 'KEPT',
        typeName: 'ACUT',
        typeDisplayName: 'ACUT',
        reasonName: '',
        providers: [ { providerName: 'BHIE, USERONE' } ],
        uid: 'urn:va:appointment:DOD:00000099:1000010344'
    };


    it('verify transform sample appointment to VPR', function() {
        var vprData = xformer(sampleDODAppointment, mockEdipi);
        expect(vprData.dateTime).toMatch(/\d{14}/);
        expect(vprData.categoryName).toEqual(sampleVPRAppointment.categoryName);
        expect(vprData.locationName).toEqual(sampleVPRAppointment.locationName);
        expect(vprData.appointmentStatus).toEqual(sampleVPRAppointment.appointmentStatus);
        expect(vprData.typeName).toEqual(sampleVPRAppointment.typeName);
        expect(vprData.facilityName).toEqual(sampleVPRAppointment.facilityName);
        expect(vprData.facilityCode).toEqual(sampleVPRAppointment.facilityCode);
        expect(vprData.typeDisplayName).toEqual(sampleVPRAppointment.typeDisplayName);
        expect(vprData.uid).toEqual(sampleVPRAppointment.uid);
        expect(vprData.reasonName).toEqual(sampleVPRAppointment.reasonName);
        expect(vprData.providers.length).toEqual(1);
        expect(vprData.providers[0].providerName).toEqual(sampleVPRAppointment.providers[0].providerName);
    });

    it('verify date skipped when null', function() {
        var filteredAppointment = _.omit(sampleDODAppointment, 'apptDate');
        var vprData = xformer(filteredAppointment, mockEdipi);
        expect(vprData.dateTime).toBeUndefined();
    });

});