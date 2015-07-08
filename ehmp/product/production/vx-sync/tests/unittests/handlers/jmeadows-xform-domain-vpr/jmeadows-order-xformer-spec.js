'use strict';

require('../../../../env-setup');
var moment = require('moment');

var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-order-xformer');

var mockEdipi = '0000000001';

describe('jmeadows-order-xformer', function() {
    var dodOrder1 = {
        'cdrEventId': '123456789',
        'codes': [{
            'code': '1000',
            'display': 'test.code.display.1',
            'system': 'LOINC'
        }],
        'patientId': null,
        'patientName': null,
        'site': {
            'agency': null,
            'dmisId': null,
            'endpoints': [

            ],
            'id': null,
            'moniker': 'DOD',
            'name': 'DOD',
            'permissions': [

            ],
            'region': null,
            'siteCode': 'DOD',
            'status': null
        },
        'sourceProtocol': 'DODADAPTER',
        'completedDate': null,
        'orderDate': 18000000,
        'orderDetail': 'CARDIAC PROFILE',
        'orderResult': null,
        'orderid': null,
        'orderingProvider': {
            'name': 'FORBES, ATTEND'
        },
        'startDate': null,
        'status': null,
        'type': 'LAB'
    };

    var vprResult1 = {
        'facilityCode': 'DOD',
        'facilityName': 'DOD',
        'name': 'CARDIAC PROFILE',
        'content': 'CARDIAC PROFILE',
        'statusName': '',
        'providerDisplayName': 'Forbes, Attend',
        'service': 'LR',
        'kind': 'Laboratory',
        'uid': 'urn:va:order:DOD:0000000001:123456789',
        'pid': 'DOD;' + mockEdipi,
        'summary': 'CARDIAC PROFILE',
        'entered': '19700101000000',
        'providerName': 'FORBES, ATTEND',
        'codes': [{
            'code': '1000',
            'system': 'http://loinc.org',
            'display': 'test.code.display.1'
        }]
    };
    var vprResult = {};
    it('transforms first sampel dod order to vpr ', function() {
        vprResult = xformer(dodOrder1, mockEdipi);
        assertFieldExpectations(vprResult, vprResult1, dodOrder1);
    });
});

function assertFieldExpectations(transformResult, expectedResult, original) {
    expect(transformResult.facilityName).toEqual(expectedResult.facilityName);
    expect(transformResult.facilityCode).toEqual(expectedResult.facilityCode);
    expect(transformResult.name).toEqual(expectedResult.name);
    expect(transformResult.codes).toEqual(expectedResult.codes);

    expect(transformResult.content).toEqual(expectedResult.content);
    expect(transformResult.statusName).toEqual(expectedResult.statusName);

    expect(transformResult.providerName).toEqual(expectedResult.providerName);
    expect(transformResult.providerDisplayName).toEqual(
        expectedResult.providerDisplayName);
    expect(transformResult.service).toEqual(expectedResult.service);

    expect(transformResult.kind).toEqual(expectedResult.kind);
    expect(transformResult.uid).toEqual(expectedResult.uid);
    expect(transformResult.summary).toEqual(expectedResult.summary);

    var expectedDate = moment(original.orderDate, 'x').format('YYYYMMDDHHmmss');
    expect(transformResult.entered).toEqual(expectedDate);
    expect(transformResult.pid).toEqual(expectedResult.pid);
}

describe('jmeadows-order-xformer', function() {
    var dodOrder2 = {
        'cdrEventId': '987654321',
        'codes': [{
            'code': '1001',
            'display': 'test.code.display.2',
            'system': 'LOINC'
        }],
        'patientId': null,
        'patientName': null,
        'site': {
            'agency': null,
            'dmisId': null,
            'endpoints': [

            ],
            'id': null,
            'moniker': 'DOD',
            'name': 'DOD',
            'permissions': [

            ],
            'region': null,
            'siteCode': 'DOD',
            'status': null
        },
        'sourceProtocol': 'DODADAPTER',
        'completedDate': null,
        'orderDate': 18000000,
        'orderDetail': 'BARIUM SWALLOW,(ESOPHAGRAM)',
        'orderResult': null,
        'orderid': null,
        'orderingProvider': {
            'name': 'SJT, DENTIST A'
        },
        'startDate': null,
        'status': null,
        'type': 'RADIOLOGY'
    };

    var vprResult2 = {
        'facilityCode': 'DOD',
        'facilityName': 'DOD',
        'name': 'BARIUM SWALLOW,(ESOPHAGRAM)',
        'content': 'BARIUM SWALLOW,(ESOPHAGRAM)',
        'statusName': '',
        'providerDisplayName': 'Sjt, Dentist A',
        'service': 'RA',
        'kind': 'Radiology',
        'uid': 'urn:va:order:DOD:0000000001:987654321',
        'pid': 'DOD;' + mockEdipi,
        'summary': 'BARIUM SWALLOW,(ESOPHAGRAM)',
        'entered': '19700101000000',
        'providerName': 'SJT, DENTIST A',
        'codes': [{
            'code': '1001',
            'system': 'http://loinc.org',
            'display': 'test.code.display.2'
        }]
    };

    var vprResult = {};
    it('transforms second sample dod order to vpr ', function() {
        vprResult = xformer(dodOrder2, mockEdipi);
        assertFieldExpectations(vprResult, vprResult2, dodOrder2);
    });
});