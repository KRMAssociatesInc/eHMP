/*jslint node: true*/
'use strict';

var PatientTimelineResource = require('../resources/patientrecord/patienttimelineResource');

describe('Verify mergeResults correctly merges multiple sets of results', function() {
    it('Correctly merges when there is no sorting and no duplicates', function() {
        var resultSets = [
            { data: { items: [{ uid: 'a' }] } },
            { data: { items: [{ uid: 'b' },{ uid: 'c' }] } },
            { data: { items: [{ uid: 'd' }] } }
        ];
        var expectedOutput = [{ uid: 'a' },{ uid: 'b' },{ uid: 'c' },{ uid: 'd' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets);
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when there are duplicate items', function() {
        var resultSets = [
            { data: { items: [{ uid: 'a' }] } },
            { data: { items: [{ uid: 'b' },{ uid: 'c' },{ uid: 'c' }] } },
            { data: { items: [{ uid: 'a' },{ uid: 'd' }] } }
        ];
        var expectedOutput = [{ uid: 'a' },{ uid: 'b' },{ uid: 'c' },{ uid: 'd' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets);
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when ascending sorting is done on a numeric field that all result sets have', function() {
        var resultSets = [
            { data: { items: [{ uid: 3 },{ uid: 6 },{ uid: 5 }] } },
            { data: { items: [{ uid: 7 },{ uid: 2 }] } },
            { data: { items: [{ uid: 1 },{ uid: 4 }] } }
        ];
        var expectedOutput = [{ uid: 1 },{ uid: 2 },{ uid: 3 },{ uid: 4 },{ uid: 5 },{ uid: 6 },{ uid: 7 }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'uid', 'asc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when descending sorting is done on a numeric field that all result sets have', function() {
        var resultSets = [
            { data: { items: [{ uid: 3 },{ uid: 6 },{ uid: 5 }] } },
            { data: { items: [{ uid: 7 },{ uid: 2 }] } },
            { data: { items: [{ uid: 1 },{ uid: 4 }] } }
        ];
        var expectedOutput = [{ uid: 7 },{ uid: 6 },{ uid: 5 },{ uid: 4 },{ uid: 3 },{ uid: 2 },{ uid: 1 }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'uid', 'desc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when ascending sorting is done on a string field that all result sets have', function() {
        var resultSets = [
            { data: { items: [{ uid: 'd' },{ uid: 'f' },{ uid: 'e' }] } },
            { data: { items: [{ uid: 'b' },{ uid: 'g' }] } },
            { data: { items: [{ uid: 'a' },{ uid: 'c' }] } }
        ];
        var expectedOutput = [{ uid: 'a' },{ uid: 'b' },{ uid: 'c' },{ uid: 'd' },{ uid: 'e' },{ uid: 'f' },{ uid: 'g' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'uid', 'asc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when descending sorting is done on a string field that all result sets have', function() {
        var resultSets = [
            { data: { items: [{ uid: 'd' },{ uid: 'f' },{ uid: 'e' }] } },
            { data: { items: [{ uid: 'b' },{ uid: 'g' }] } },
            { data: { items: [{ uid: 'a' },{ uid: 'c' }] } }
        ];
        var expectedOutput = [{ uid: 'g' },{ uid: 'f' },{ uid: 'e' },{ uid: 'd' },{ uid: 'c' },{ uid: 'b' },{ uid: 'a' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'uid', 'desc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when ascending sorting is done on a string field that is sometimes undefined', function() {
        var resultSets = [
            { data: { items: [{ uid: 'd', val: 'dd' },{ uid: 'f', val: 'ff' },{ uid: 'e', val: 'ee' }] } },
            { data: { items: [{ uid: 'b', val: 'bb' },{ uid: 'g', val: 'gg' },{ uid: 'z', otherVal: 'zz' }] } }, //include one where the sort field is undefined
            { data: { items: [{ uid: 'a', val: 'aa' },{ uid: 'c', val: 'cc' }] } }
        ];
        var expectedOutput = [{ uid: 'z', otherVal: 'zz' },{ uid: 'a', val: 'aa' },{ uid: 'b', val: 'bb' },{ uid: 'c', val: 'cc' },{ uid: 'd', val: 'dd' },{ uid: 'e', val: 'ee' },{ uid: 'f', val: 'ff' },{ uid: 'g', val: 'gg' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'val', 'asc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when descending sorting is done on a string field that is sometimes undefined', function() {
        var resultSets = [
            { data: { items: [{ uid: 'd', val: 'dd' },{ uid: 'f', val: 'ff' },{ uid: 'e', val: 'ee' }] } },
            { data: { items: [{ uid: 'b', val: 'bb' },{ uid: 'g', val: 'gg' },{ uid: 'z', otherVal: 'zz' }] } }, //include one where the sort field is undefined
            { data: { items: [{ uid: 'a', val: 'aa' },{ uid: 'c', val: 'cc' }] } }
        ];
        var expectedOutput = [{ uid: 'g', val: 'gg' },{ uid: 'f', val: 'ff' },{ uid: 'e', val: 'ee' },{ uid: 'd', val: 'dd' },{ uid: 'c', val: 'cc' },{ uid: 'b', val: 'bb' },{ uid: 'a', val: 'aa' },{ uid: 'z', otherVal: 'zz' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'val', 'desc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when ascending sorting is done on a field that not all result sets have', function() {
        var resultSets = [
            { data: { items: [{ uid: 'd', val: 'dd' },{ uid: 'f', val: 'ff' },{ uid: 'e', val: 'ee' }] } },
            { data: { items: [{ uid: 'x', otherVal: 'xx' },{ uid: 'y', otherVal: 'yy' },{ uid: 'z', otherVal: 'zz' }] } },
            { data: { items: [{ uid: 'a', val: 'aa' },{ uid: 'c', val: 'cc' }] } }
        ];

        var expectedOutput = [{ uid: 'x', otherVal: 'xx' },{ uid: 'y', otherVal: 'yy' },{ uid: 'z', otherVal: 'zz' },{ uid: 'a', val: 'aa' },
                { uid: 'c', val: 'cc' },{ uid: 'd', val: 'dd' },{ uid: 'e', val: 'ee' },{ uid: 'f', val: 'ff' }];

        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'val', 'asc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Correctly merges when descending sorting is done on a field that not all result sets have', function() {
        var resultSets = [
            { data: { items: [{ uid: 'x', otherVal: 'xx' },{ uid: 'y', otherVal: 'yy' },{ uid: 'z', otherVal: 'zz' }] } },
            { data: { items: [{ uid: 'd', val: 'dd' },{ uid: 'f', val: 'ff' },{ uid: 'e', val: 'ee' }] } },
            { data: { items: [{ uid: 'a', val: 'aa' },{ uid: 'c', val: 'cc' }] } }
        ];

        var expectedOutput = [{ uid: 'f', val: 'ff' },{ uid: 'e', val: 'ee' },{ uid: 'd', val: 'dd' },{ uid: 'c', val: 'cc' },
                { uid: 'a', val: 'aa' },{ uid: 'z', otherVal: 'zz' },{ uid: 'y', otherVal: 'yy' },{ uid: 'x', otherVal: 'xx' }];

        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'val', 'desc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Does not fail if one of the result sets is empty', function() {
        var resultSets = [
            { data: { items: [] } },
            { data: { items: [{ uid: 'b' },{ uid: 'c' }] } },
            { data: { items: [{ uid: 'd' }] } }
        ];
        var expectedOutput = [{ uid: 'b' },{ uid: 'c' },{ uid: 'd' }];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'uid', 'asc');
        expect(actualOutput).toEqual(expectedOutput);
    });
    it('Returns empty list when there are no results', function() {
        var resultSets = [
            { data: { items: [] } },
            { data: { items: [] } },
            { data: { items: [] } }
        ];
        var expectedOutput = [];
        var actualOutput = PatientTimelineResource.mergeResults(resultSets, 'val', 'asc');
        expect(actualOutput).toEqual(expectedOutput);
    });
});

describe('Verify getActivityDateTime returns the correct time.', function() {

    it('should return administeredDateTime if an immunization', function() {
       expect(PatientTimelineResource.getActivityDateTime({kind:'Immunization', dateTime:'2014', administeredDateTime:'2013'})).toBe('2013');
    });
    it('should return dateTime if not a discharged patient', function() {

        expect(PatientTimelineResource.getActivityDateTime({kind:'visit', dateTime: '19990101', stay:{dischargeDateTime:'20140101'}})).toBe('19990101');
    });
    it('should return dateTime if not a discharged patient, (no stay information)', function() {

        expect(PatientTimelineResource.getActivityDateTime({kind: 'visit', dateTime: '19990101'})).toBe('19990101');
    });
    it('should return stay.dischargedDateTime if a discharged patient', function() {
        expect(PatientTimelineResource.getActivityDateTime({kind:'visit', dateTime: '19990101', stay:{dischargeDateTime:'20140101'}, categoryCode:'urn:va:encounter-category:AD'})).toBe('20140101');
    });
});

describe('Verify isVisit returns true/false correctly', function() {

    it('should return false when kind is undefined', function() {
        var model = {};
        expect(PatientTimelineResource.isVisit(model)).toBe(false);
    });
    it('should return false when kind is undefined', function() {
        var model = {kind: undefined};
        expect(PatientTimelineResource.isVisit(model)).toBe(false);
    });
    it('should return true when kind is visit', function() {
        var model = {kind: 'visiT'};
        expect(PatientTimelineResource.isVisit(model)).toBe(true);
    });
    it('should return true when kind is admission', function() {
        var model = {kind: 'adMISSion'};
        expect(PatientTimelineResource.isVisit(model)).toBe(true);
    });
    it('should return false when kind is not visit or admission', function() {
        var model = {kind: 'immunization'};
        expect(PatientTimelineResource.isVisit(model)).toBe(false);
    });
});

describe('Verify isHospitalization returns correctly.', function() {

    it('should return false when category Code is undefined', function() {
        expect(PatientTimelineResource.isHospitalization({})).toBe(false);
    });
    it('should return false when category Code is undefined', function() {
        expect(PatientTimelineResource.isHospitalization({categoryCode:undefined})).toBe(false);
    });
    it('should return false when category Code is not an encounter', function() {
        expect(PatientTimelineResource.isHospitalization({categoryCode:'notAnEncounter'})).toBe(false);
    });
    it('should return true when categoryCode is an encounter', function() {
        expect(PatientTimelineResource.isHospitalization({categoryCode:'urn:va:encounter-category:AD'})).toBe(true);
    });
    it('should return false when categoryCode is an empty string', function() {
        expect(PatientTimelineResource.isHospitalization({categoryCode:''})).toBe(false);
    });
    it('should return false when categoryCode undefined', function() {
        expect(PatientTimelineResource.isHospitalization({categoryCode:''})).toBe(false);
    });
});

describe('Verify isDischargedOrAdmitted returns true when discharged and false when admitted.', function() {

    it('should return false when stay is undefined', function() {
        expect(PatientTimelineResource.isDischargedOrAdmitted({})).toBe(false);
    });
    it('should return true when stay.dischargedDateTime is not undefined', function() {
        expect(PatientTimelineResource.isDischargedOrAdmitted({stay:{dischargeDateTime:'20140101'}})).toBe(true);
    });
    it('should return false when stay.dischargedDateTime is undefined', function() {
        expect(PatientTimelineResource.isDischargedOrAdmitted({stay:{}})).toBe(false);
    });
});

describe('Verify isImmunization returns true/false correctly', function() {

    it('should return false when kind is undefined', function() {
        var model = {};
        expect(PatientTimelineResource.isImmunization(model)).toBe(false);
    });
    it('should return false when kind is undefined', function() {
        var model = {kind: undefined};
        expect(PatientTimelineResource.isImmunization(model)).toBe(false);
    });
    it('should return true when kind is immunization', function() {
        var model = {kind: 'immunization'};
        expect(PatientTimelineResource.isImmunization(model)).toBe(true);
    });
    it('should return true when kind is immunization', function() {
        var model = {kind: 'IMMUNIZATION'};
        expect(PatientTimelineResource.isImmunization(model)).toBe(true);
    });
    it('should return false when kind is not immunization', function() {
        var model = {kind: 'Visit'};
        expect(PatientTimelineResource.isImmunization(model)).toBe(false);
    });
});

describe('Verify isLaboratory returns true/false correctly', function() {
    it('should return false when kind is undefined', function() {
        var model = {};
        expect(PatientTimelineResource.isLaboratory(model)).toBe(false);
    });
    it('should return false when kind is undefined', function() {
        var model = {kind: undefined};
        expect(PatientTimelineResource.isLaboratory(model)).toBe(false);
    });
    it('should return true when kind is laboratory', function() {
        var model = {kind: 'LaBORatory'};
        expect(PatientTimelineResource.isLaboratory(model)).toBe(true);
    });
    it('should return true when kind is microbiology', function() {
        var model = {kind: 'MicroBIOLogy'};
        expect(PatientTimelineResource.isLaboratory(model)).toBe(true);
    });
    it('should return false when kind is not laboratory or microbiology', function() {
        var model = {kind: 'Visit'};
        expect(PatientTimelineResource.isLaboratory(model)).toBe(false);
    });
});
