'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var moment = require('moment');
var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-problem-xformer');

var mockEdipi = '0000000001';

var sampleDodProblem = {
    'cdrEventId': '987654321',
    'codes': [],
    'patientId': null,
    'patientName': null,
    'site': {
        'agency': null,
        'dmisId': null,
        'endpoints': [],
        'id': null,
        'moniker': 'DOD',
        'name': 'DOD',
        'permissions': [],
        'region': null,
        'siteCode': 'DOD',
        'status': null
    },
    'sourceProtocol': 'DODADAPTER',
    'acuity': 'problem.1.acuity',
    'condition': null,
    'description': 'problem.1.detail.text',
    'hasComment': null,
    'hospitalLocation': 'problem.1.hospital.location',
    'icdCode': 'problem.1.icd.code',
    'id': null,
    'inactiveICDCode': null,
    'lastModifiedDate': 1313899200000,
    'locationIEN': 'problem.1.location.ien',
    'locationType': null,
    'onsetDate': 1237003200000,
    'priority': null,
    'providerIEN': null,
    'recordedDate': null,
    'responsibleProvider': null,
    'scConditions': null,
    'serviceConnected': true,
    'serviceIEN': null,
    'serviceName': null,
    'specialExposure': null,
    'status': 'problem.1.status',
    'detailText': null,
    'enteredBy': 'problem.1.provider',
    'enteredDate': 1282363200000,
    'notes': [{
        'cdrEventId': null,
        'codes': [],
        'patientId': null,
        'patientName': null,
        'site': null,
        'sourceProtocol': null,
        'noteDate': null,
        'noteEnteredBy': null,
        'noteText': 'problem.1.note.1.text'
    }, {
        'cdrEventId': null,
        'codes': [],
        'patientId': null,
        'patientName': null,
        'site': null,
        'sourceProtocol': null,
        'noteDate': null,
        'noteEnteredBy': null,
        'noteText': 'problem.1.note.2.text'
    }],
    'recordedBy': null
};


var expectedResult = {
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'locationName': 'problem.1.hospital.location',
    'providerName': 'problem.1.provider',
    'problemText': 'problem.1.detail.text',
    'icdCode': 'problem.1.icd.code',
    'acuityName': 'problem.1.acuity',
    'entered': '20100821000000',
    'updated': '20110821000000',
    'pid': 'DOD;' + mockEdipi,
    'onset': '20090314000000',
    'kind': 'Problem',
    'uid': 'urn:va:problem:DOD:0000000001:987654321',
    'summary': 'problem.1.detail.text',
    'locationDisplayName': 'Problem.1.Hospital.Location',
    'providerDisplayName': 'problem.1.provider',
    'statusName': 'problem.1.status',
    'statusDisplayName': 'Problem.1.Status',
    'serviceConnected': true,
    'comments': [{
        'comment': 'problem.1.note.1.text',
        'summary': 'ProblemComment{uid=\'null\'}'
    }, {
        'comment': 'problem.1.note.2.text',
        'summary': 'ProblemComment{uid=\'null\'}'
    }]
};

describe('jmeadows-problem-xformer', function() {
    var vprResult = {};
    it('transforms sample dod problem to vpr ', function() {
        vprResult = xformer(sampleDodProblem, mockEdipi);
        assertFieldExpectations(vprResult, expectedResult, sampleDodProblem);

        expect(vprResult.comments.length).toEqual(
            expectedResult.comments.length);
        for (var i = 0; i < vprResult.comments.length; i++) {
            expect(vprResult.comments[i].comment).toEqual(
                expectedResult.comments[i].comment);
        }
    });
});

function assertFieldExpectations(transformResult, expectedResult, original) {
    expect(transformResult.facilityName).toEqual(expectedResult.facilityName);
    expect(transformResult.facilityCode).toEqual(expectedResult.facilityCode);
    expect(transformResult.locationName).toEqual(expectedResult.locationName);
    expect(transformResult.providerName).toEqual(expectedResult.providerName);

    expect(transformResult.problemText).toEqual(expectedResult.problemText);
    expect(transformResult.icdCode).toEqual(expectedResult.icdCode);
    expect(transformResult.acuityName).toEqual(expectedResult.acuityName);

    var expectedDate;
    if (original.enteredDate) {
        expectedDate = moment(original.enteredDate, 'x').format('YYYYMMDDHHmmss');
        expect(transformResult.entered).toEqual(expectedDate);
    } else {
        expect(_.isNull(transformResult.entered));
    }

    expect(transformResult.pid).toEqual(expectedResult.pid);

    if (original.lastModifiedDate) {
        expectedDate = moment(original.lastModifiedDate, 'x').format('YYYYMMDDHHmmss');
        expect(transformResult.updated).toEqual(expectedDate);
    } else {
        expect(_.isNull(transformResult.updated));
    }

    if (original.onsetDate) {
        expectedDate = moment(original.onsetDate, 'x').format('YYYYMMDDHHmmss');
        expect(transformResult.onset).toEqual(expectedDate);
    } else {
        expect(_.isNull(transformResult.onset));
    }

    expect(transformResult.kind).toEqual(expectedResult.kind);
    expect(transformResult.uid).toEqual(expectedResult.uid);
    expect(transformResult.summary).toEqual(expectedResult.summary);
    expect(transformResult.locationDisplayName).toEqual(
        expectedResult.locationDisplayName);
    expect(transformResult.providerDisplayName).toEqual(
        expectedResult.providerDisplayName);
    expect(transformResult.statusName).toEqual(expectedResult.statusName);
    expect(transformResult.statusDisplayName).toEqual(
        expectedResult.statusDisplayName);
    expect(transformResult.serviceConnected).toEqual(
        expectedResult.serviceConnected);
}

var dodWithNullsForConditions = {
    'cdrEventId': '987654321',
    'codes': [],
    'patientId': null,
    'patientName': null,
    'site': {
        'agency': null,
        'dmisId': null,
        'endpoints': [],
        'id': null,
        'moniker': 'DOD',
        'name': 'DOD',
        'permissions': [],
        'region': null,
        'siteCode': 'DOD',
        'status': null
    },
    'sourceProtocol': 'DODADAPTER',
    'acuity': 'problem.1.acuity',
    'condition': null,
    'description': null,
    'hasComment': null,
    'hospitalLocation': 'problem.1.hospital.location',
    'icdCode': 'problem.1.icd.code',
    'id': null,
    'inactiveICDCode': null,
    'lastModifiedDate': null,
    'locationIEN': 'problem.1.location.ien',
    'locationType': null,
    'onsetDate': null,
    'priority': null,
    'providerIEN': null,
    'recordedDate': null,
    'responsibleProvider': null,
    'scConditions': null,
    'serviceConnected': null,
    'serviceIEN': null,
    'serviceName': null,
    'specialExposure': null,
    'status': 'problem.1.status',
    'detailText': null,
    'enteredBy': 'problem.1.provider',
    'enteredDate': null,
    'notes': null,
    'recordedBy': null
};

var expectedResultWithNulls = {
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'locationName': 'problem.1.hospital.location',
    'providerName': 'problem.1.provider',
    'problemText': 'NULL',
    'icdCode': 'problem.1.icd.code',
    'acuityName': 'problem.1.acuity',
    'pid': 'DOD;' + mockEdipi,
    'entered': null,
    'updated': null,
    'onset': null,
    'kind': 'Problem',
    'uid': 'urn:va:problem:DOD:0000000001:987654321',
    'summary': 'NULL',
    'locationDisplayName': 'Problem.1.Hospital.Location',
    'providerDisplayName': 'problem.1.provider',
    'statusName': 'problem.1.status',
    'statusDisplayName': 'Problem.1.Status',
    'serviceConnected': false,
    'comments': null
};

describe('jmeadows-problem-xformer-nullish-input', function() {
    var vprResult = {};
    it('transforms nullish dod problem to vpr ', function() {

        vprResult = xformer(dodWithNullsForConditions, mockEdipi);

        assertFieldExpectations(vprResult, expectedResultWithNulls, dodWithNullsForConditions);

        expect(vprResult.comments).toEqual(null);
    });
});