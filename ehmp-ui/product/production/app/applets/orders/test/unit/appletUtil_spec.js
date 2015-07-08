/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

define([
    'jquery',
    'backbone',
    'marionette',
    'jasminejquery',
    'app/applets/orders/util'
], function($, Backbone, Marionette, jasminejquery, util) {

    var response = {},
        pendingStyle = 'label label-warning',
        completeStyle = 'label label-success',
        expiredStyle = 'label label-danger',
        discontinuedStyle = 'label label-info',
        activeStyle = 'label label-success',
        defaultStyle = 'label label-default';

    var labSummary1 = 'PROTIME BLOOD   PLASMA SP LB #2156',
        labSummary2 = 'HEMOGLOBIN A1C BLOOD   LC LB #12889',
        labSummary3 = 'TRIGLYCERIDE SERUM WC LB #5507',
        labSummary4 = 'Default BLOOD   PLASMA IC 2156',
        labArray1 = ['SEND PATIENT', 'BLOOD', 'PLASMA'],
        labArray2 = ['LAB COLLECT', 'BLOOD', ''],
        labArray3 = ['WARD COLLECT', '', 'SERUM'];
    var labArray4 = ['Not Found', 'Not Found', 'Not Found'];



    describe("Determine that the status style is returned correctly", function() {
        it("Should return label-warning if status is pending", function() {
            response.statusName = 'pending';
            expect(util.getStatusStyle(response).statusStyle).toEqual(pendingStyle);
        });

        it("Should return label-warning if status is PENDING", function() {
            response.statusName = 'PENDING';
            expect(util.getStatusStyle(response).statusStyle).toEqual(pendingStyle);
        });

        it("Should return label label-success if status is complete", function() {
            response.statusName = 'complete';
            expect(util.getStatusStyle(response).statusStyle).toEqual(completeStyle);
        });

        it("Should return label label-success if status is COMPLETE", function() {
            response.statusName = 'COMPLETE';
            expect(util.getStatusStyle(response).statusStyle).toEqual(completeStyle);
        });

        it("Should return label label-danger if status is expired", function() {
            response.statusName = 'expired';
            expect(util.getStatusStyle(response).statusStyle).toEqual(expiredStyle);
        });

        it("Should return label label-danger if status is EXPIRED", function() {
            response.statusName = 'EXPIRED';
            expect(util.getStatusStyle(response).statusStyle).toEqual(expiredStyle);
        });

        it("Should return label label-info if status is discontinued", function() {
            response.statusName = 'discontinued';
            expect(util.getStatusStyle(response).statusStyle).toEqual(discontinuedStyle);
        });

        it("Should return label label-info if status is DISCONTINUED", function() {
            response.statusName = 'DISCONTINUED';
            expect(util.getStatusStyle(response).statusStyle).toEqual(discontinuedStyle);
        });

        it("Should return label label-success if status is active", function() {
            response.statusName = 'active';
            expect(util.getStatusStyle(response).statusStyle).toEqual(activeStyle);
        });

        it("Should return label label-success if status is ACTIVE", function() {
            response.statusName = 'ACTIVE';
            expect(util.getStatusStyle(response).statusStyle).toEqual(activeStyle);
        });

        it("Should return label label-default if status is anything else", function() {
            response.statusName = 'other';
            expect(util.getStatusStyle(response).statusStyle).toEqual(defaultStyle);
        });

    });

    describe("Determine that the facility style is returned correctly", function() {
        it("Should return 'DOD' if facilityCode is DOD", function() {
            response.facilityCode = 'DOD';
            expect(util.getFacilityColor(response).facilityColor).toEqual('DOD');
        });

        it("Should return 'nonDOD' if facilityCode is not DOD", function() {
            response.facilityCode = 'other';
            expect(util.getFacilityColor(response).facilityColor).toEqual('nonDOD');
        });

    });

    describe("Determine that the lab Type, Sample and Specimen values are parsed and returned correctly", function() {
        it("Should return '1-2-3 Values' if input is labSummary1", function() {
            expect(util.parseLabSampleString(labSummary1)).toEqual(labArray1);
        });

        it("Should return '1-2 Values' if input is labSummary2", function() {
            expect(util.parseLabSampleString(labSummary2)).toEqual(labArray2);
        });

        it("Should return '1-3 Values' if input is labSummary3", function() {
            expect(util.parseLabSampleString(labSummary3)).toEqual(labArray3);
        });

        it("Should return 'All Not Found Values' if input is labSummary4", function() {
            expect(util.parseLabSampleString(labSummary4)).toEqual(labArray4);
        });

    });

    describe('Determine that the order signers are parsed correctly', function() {
        it('Should return Provider,One if role is S', function() {
            response.clinicians = [{
                'name': 'Provider,One',
                'role': 'S'
            }];
            expect(util.getSigners(response).provider).toEqual('Provider,One');
        });

        it('Should return Nurse,One if role is N', function() {
            response.clinicians = [{
                'name': 'Nurse,One',
                'role': 'N'
            }];
            expect(util.getSigners(response).nurse).toEqual('Nurse,One');
        });

        it('Should return Clerk,One if role is C', function() {
            response.clinicians = [{
                'name': 'Clerk,One',
                'role': 'C'
            }];
            expect(util.getSigners(response).clerk).toEqual('Clerk,One');
        });

        it('Should return Chart,One if role is R', function() {
            response.clinicians = [{
                'name': 'Chart,One',
                'role': 'R'
            }];
            expect(util.getSigners(response).chart).toEqual('Chart,One');
        });
    });

    var signBy1 = {
            byName: 'Provider,One on ',
            onDate: '200404010101'
        },
        signBy2 = {
            byName: 'PATHO,TWO on ',
            onDate: '200404010202'
        },
        signBy3 = {
            byName: ' on ',
            onDate: '200404010301'
        },
        signBy4 = {
            byName: 'PATHY,ERR on ',
            onDate: ''
        },
        signBy5 = {
            byName: '',
            onDate: ''
        },
        signBy6 = {
            byName: '',
            onDate: ''
        };
    var clinicians1 = [{
            'name': 'Provider,One',
            'role': 'S',
            signedDateTime: '200404010101',
            uid: 'urn:va:user:9E7A:11748'
        }],
        clinicians2 = [{
            name: 'PAT,NO_DATA',
            role: 'Q',
            signedDateTime: '200404010201',
            uid: 'urn:va:user:9E7A:11748'
        }, {
            name: 'PATHO,TWO',
            role: 'S',
            signedDateTime: '200404010202',
            uid: 'urn:va:user:9E7A:11748'
        }],
        clinicians3 = [{
            name: '',
            role: 'K',
            signedDateTime: '200404010301',
            uid: 'urn:va:user:9E7A:11748'
        }],
        clinicians4 = [{
            name: 'PATHY,ERR',
            role: 'T',
            signedDateTime: '',
            uid: 'urn:va:user:9E7A:11748'
        }],
        clinicians5 = null, //
        clinicians6 = []; //
    describe("Determine that the Order Signature is parsed correctly from clinicians attribute", function() {

        it("Should return 'signBy1 Values - valid' if input is clinicians1", function() {
            expect(util.parseForSignature(clinicians1)).toEqual(signBy1);
        });

        it("Should return 'signBy2 Values - Second Sign' if input is clinicians2", function() {
            expect(util.parseForSignature(clinicians2)).toEqual(signBy2);
        });

        it("Should return 'signBy3 Values - DataError' if input is clinicians3", function() {
            expect(util.parseForSignature(clinicians3)).toEqual(signBy3);
        });
        it("Should return 'signBy4 Values - DataError' if input is clinicians4", function() {
            expect(util.parseForSignature(clinicians4)).toEqual(signBy4);
        });
        it("Should return 'signBy5 Values - DataError' if input is clinicians5", function() {
            expect(util.parseForSignature(clinicians5)).toEqual(signBy5);
        });
        it("Should return 'signBy6 Values - DataError' if input is clinicians6", function() {
            expect(util.parseForSignature(clinicians6)).toEqual(signBy6);
        });

    });

    var order1 = "HDL BLOOD SERUM WC LB #17433\r\n", // Lab
        order2 = "urn:va:order:9E7A:3:33089", // NON-Lab
        order3 = "urn:va:order:9E7A:3:33089"; // JUNK
    var num1 = "17433",
        num2 = "33089",
        num3 = ""; // Blank
    describe('Determine that the order-number is parsed correctly', function() {
        it('Should return num1 if input is order1', function() {
            expect(util.parseForOrderNumber(order1, true)).toEqual(num1);
        });

        it('Should return num2 if input is order2', function() {
            expect(util.parseForOrderNumber(order2, false)).toEqual(num2);
        });

        it('Should return num3 if input is order3', function() {
            expect(util.parseForOrderNumber(order3, true)).toEqual(num3);
        });
    });

});
