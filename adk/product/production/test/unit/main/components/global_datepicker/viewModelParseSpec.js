define([
    "backbone",
    "marionette",
    "underscore",
    "jasminejquery",
    "main/components/global_datepicker/util/parseEvents",
    "moment"
], function(Backbone, Marionette, _, jasmine, parseEvents, Moment) {
    'use strict';
    var dateFormatFull = 'YYYYMMDDHHmmss';

    //to see results in a tests console output try:
    //console.error(JSON.stringify(results));

    describe("parseEvents", function() {
        it("handles empty object", function() {
            var testObject = {};
            var results = parseEvents(testObject);
            expect(results).toEqual(testObject);
        });

        it("handles undefined", function() {
            var testObject;
            var results = parseEvents(testObject);
            expect(results).toEqual({});
        });

        it("handles empty inpatient", function() {
            var testObject = {
                inpatient: [],
                outpatient: []
            };
            var results = parseEvents(testObject);
            expect(results).toEqual(testObject);
        });

        it("handles 1 day inpatient", function() {
            var testObject = {
                "inpatient": [{
                    "kind": "Admission",
                    "dateTime": "199901010000",
                    "stay": {
                        "arrivalDateTime": "199901010000",
                        "dischargeDateTime": "199901012359"
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }]
            };
            var results = parseEvents(testObject);
            expect(results.inpatient.length).toEqual(1);
            // 1991-01-01
        });

        it("handles 2 day inpatient", function() {
            var testObject = {
                "inpatient": [{
                    "kind": "Admission",
                    "dateTime": "199901010000",
                    "stay": {
                        "arrivalDateTime": "199901010000",
                        "dischargeDateTime": "199901020000"
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }]
            };
            var results = parseEvents(testObject);
            expect(results.inpatient.length).toEqual(2);
            // 1991-01-01, 1991-01-02
        });

        it("does not add future events for ongoing admissions", function() {
            var dateTime = new Moment().subtract(2, 'days').format(dateFormatFull);
            var testObject = {
                "inpatient": [{
                    "kind": "Admission",
                    "dateTime": dateTime,
                    "stay": {
                        "arrivalDateTime": dateTime
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }]
            };
            var results = parseEvents(testObject);
            expect(results.inpatient.length).toEqual(3);
            // 2 days ago, yesterday, today
        });

        it("stops an ongoing admission at next admission date", function() {
            var testObject = {
                "inpatient": [{
                    "kind": "Admission",
                    "dateTime": "199901010000",
                    "stay": {
                        "arrivalDateTime": "199901010000"
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }, {
                    "kind": "Admission",
                    "dateTime": "199901030000",
                    "stay": {
                        "arrivalDateTime": "199901030000",
                        "dischargeDateTime": "199901040000"
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }]
            };
            var results = parseEvents(testObject);
            expect(results.inpatient.length).toEqual(5);
            // 1991-01-01, 1991-01-02, 1991-01-03
            // 1991-01-03, 1991-01-04
        });

        it("allows for duplicate stays at separate facilites", function() {
            var testObject = {
                "inpatient": [{
                    "kind": "Admission",
                    "dateTime": "199901030000",
                    "stay": {
                        "arrivalDateTime": "199901030000",
                        "dischargeDateTime": "199901040000"
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }, {
                    "kind": "Admission",
                    "dateTime": "199901030000",
                    "stay": {
                        "arrivalDateTime": "199901030000",
                        "dischargeDateTime": "199901040000"
                    },
                    "patientClassCode": "urn:va:patient-class:IMP",
                    "typeName": "HOSPITALIZATION"
                }]
            };
            var results = parseEvents(testObject);
            expect(results.inpatient.length).toEqual(4);
            // 1991-01-03, 1991-01-04
            // 1991-01-03, 1991-01-04
        });
    });
});