/*jslint node: true */
'use strict';

var globalTimeline = require('../resources/globaltimeline/globaltimelineResource');
var moment = require('moment');
//var util = require('util');

describe('Global Timeline Resource', function() {
    it('tests that getResourceConfig() is setup correctly for globalTimeline', function() {
        var resources = globalTimeline.getResourceConfig();

        expect(resources[0].name).toEqual('getTimeline');
        expect(resources[0].path).toEqual('');
        expect(resources[0].interceptors).toEqual({
            pep: false,
            synchronize: true
        });
        expect(resources[0].healthcheck).toBeDefined();
        expect(resources[0].parameters).toBeDefined();
        expect(resources[0].get).toBeDefined();
    });

    it('correctly trims result objects given dateTime', function() {
        var value = {
            dateTime: '1234',
            kind: 'kind',
            stay: 'stay',
            garbage: 'garbage'
        };
        var arr = [];
        arr.push(value);
        globalTimeline._trimResultObjects(arr[0], 0, arr);

        expect(arr.length).toBe(1);
        expect(arr[0].dateTime.length).toBe(14);
        expect(arr[0].kind).toBeDefined();
        expect(arr[0].stay).toBeDefined();
        expect(arr[0].garbage).toBeUndefined();
    });

    it('correctly trims result objects given referenceDateTime', function() {
        var value = {
            referenceDateTime: 1990,
            beep: 'boop'
        };
        var arr = [];
        arr.push(value);
        globalTimeline._trimResultObjects(arr[0], 0, arr);
        //console.log(util.inspect(arr, { showHidden: true, depth: null, colors: true }));

        expect(arr.length).toBe(1);
        expect(arr[0].referenceDateTime.length).toBe(14);
        expect(arr[0].beep).toBeUndefined();
    });

    it('correctly pads number objects', function() {
        var result = globalTimeline._rightPad('1');
        expect(result).toBe('10000000000000');

        result = globalTimeline._rightPad(1);
        expect(result).toBe('10000000000000');
    });

    it('correctly sorts dateTime objects', function() {
        var arrA = [{
            dateTime: '19900000000000'
        }, {
            dateTime: '19990000000000'
        }, {
            referenceDateTime: '19850000000000'
        }, {
            referenceDateTime: '19940000000000'
        }];
        var arrB = arrA.sort(globalTimeline._sortByDateTime);
        expect(arrB).toEqual([{
            referenceDateTime: '19850000000000'
        }, {
            dateTime: '19900000000000'
        }, {
            referenceDateTime: '19940000000000'
        }, {
            dateTime: '19990000000000'
        }]);
    });

    describe('Inpatient/Outpatient sorting', function() {

        it('correctly sorts empty JDS results', function() {
            var JDSresults = {};
            var expected = {
                inpatient: [],
                outpatient: [],
                inpatientCount: 0,
                outpatientCount: 0
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('ignores unclassifiable data', function() {
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'UNKNOWN'
                        }]
                    }
                }
            };
            var expected = {
                inpatient: [],
                outpatient: [],
                inpatientCount: 0,
                outpatientCount: 0
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('correctly sorts discharge summaries', function() {
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'Discharge Summary'
                        }]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'Discharge Summary'
                }],
                outpatient: [],
                inpatientCount: 1,
                outpatientCount: 0
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('correctly sorts admissions and visits', function() {
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'Admission',
                            dateTime: '19940000000000',
                            patientClassCode: 'urn:va:patient-class:IMP'
                        }, {
                            kind: 'Visit',
                            dateTime: '19950000000000',
                            patientClassCode: 'urn:va:patient-class:IMP'
                        }, {
                            kind: 'Admission',
                            dateTime: '19960000000000',
                            patientClassCode: 'urn:va:patient-class:AMB'
                        }, {
                            kind: 'Visit',
                            dateTime: '19970000000000',
                            patientClassCode: 'urn:va:patient-class:AMB'
                        }, ]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'Admission',
                    dateTime: '19940000000000'
                }, {
                    kind: 'Visit',
                    dateTime: '19950000000000'
                }],
                outpatient: [{
                    kind: 'Admission',
                    dateTime: '19960000000000'
                }, {
                    kind: 'Visit',
                    dateTime: '19970000000000'
                }],
                inpatientCount: 2,
                outpatientCount: 2
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('correctly sorts DoD data', function() {
            var futuredate1 = moment().add(1, 'year');
            var futuredate2 = moment().add(1, 'day');
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'DoD Appointment',
                            dateTime: globalTimeline._rightPad(futuredate1.format('YYYYMMDD')),
                            typeName: 'INPATIENT'
                        }, {
                            kind: 'DoD Appointment',
                            dateTime: globalTimeline._rightPad(futuredate2.format('YYYYMMDD'))
                        }, {
                            kind: 'DoD Encounter',
                            dateTime: '19960000000000',
                            typeName: 'RNDS*'
                        }, {
                            kind: 'DoD Encounter',
                            dateTime: '19970000000000',
                            typeName: 'ACUT'
                        }, ]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'DoD Encounter',
                    dateTime: '19960000000000'
                }, {
                    kind: 'DoD Appointment',
                    dateTime: globalTimeline._rightPad(futuredate1.format('YYYYMMDD'))
                }],
                outpatient: [{
                    kind: 'DoD Encounter',
                    dateTime: '19970000000000'
                }, {
                    kind: 'DoD Appointment',
                    dateTime: globalTimeline._rightPad(futuredate2.format('YYYYMMDD'))
                }],
                inpatientCount: 2,
                outpatientCount: 2
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('ignores cancelled VA appointments', function() {
            var futuredate = moment().add(1, 'year');
            var futuredate2 = moment().add(1, 'day');
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'Visit', //future scheduled appointment - YES
                            dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD')),
                            appointmentStatus: 'CHECKED IN'
                        }, {
                            kind: 'Visit', //this shouldn't happen -- a future appointment without appointment status - YES
                            dateTime: globalTimeline._rightPad(futuredate2.format('YYYYMMDD'))
                        }, {
                            kind: 'Visit', //past canceled appointment - NO
                            dateTime: '19940000000000',
                            appointmentStatus: 'CANCELLED BY PATIENT'
                        }, {
                            kind: 'Visit', //past visit without appointmentStatus -- an actual event - YES
                            dateTime: '19850219000000'
                        }, {
                            kind: 'Visit', //future cancelled appointment - NO
                            dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD')),
                            appointmentStatus: 'CANCELLED BY PATIENT'
                        }, {
                            kind: 'Visit', //future scheduled inpatient appointment - YES
                            dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD')),
                            appointmentStatus: 'SCHEDULED/KEPT',
                            patientClassCode: 'urn:va:patient-class:IMP'
                        }]
                    }
                }
            };
            var expected = {
                inpatient: [{
                            kind: 'Visit',
                            dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD'))
                        }],
                outpatient: [{
                    kind: 'Visit',
                    dateTime: '19850219000000'
                }, {
                    kind: 'Visit',
                    dateTime: globalTimeline._rightPad(futuredate2.format('YYYYMMDD'))
                }, {
                    kind: 'Visit',
                    dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD'))
                }, ],
                inpatientCount: 1,
                outpatientCount: 3
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('only adds future DoD appointments', function() {
            var futuredate = moment().add(1, 'year');
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'DoD Appointment',
                            dateTime: '19940000000000',
                            typeName: 'INPATIENT'
                        }, {
                            kind: 'DoD Appointment',
                            dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD')),
                            typeName: 'INPATIENT'
                        }]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'DoD Appointment',
                    dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD'))
                }],
                outpatient: [],
                inpatientCount: 1,
                outpatientCount: 0
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        it('ignores cancelled DoD appointments', function() {
            var futuredate = moment().add(1, 'year');
            var futuredate2 = moment().add(1, 'day');
            var futuredate3 = moment().add(1, 'month');
            var futuredate4 = moment().add(1, 'week');
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'DoD Appointment', //past and WALK-IN - NO
                            dateTime: '19940000000000',
                            typeName: 'INPATIENT',
                            appointmentStatus: 'WALK-IN'
                        }, {
                            kind: 'DoD Appointment', //future with appt status PENDING - YES
                            dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD')),
                            typeName: 'INPATIENT',
                            appointmentStatus: 'PENDING'
                        }, {
                            kind: 'DoD Appointment', //future and cancelled - NO
                            dateTime: globalTimeline._rightPad(futuredate3.format('YYYYMMDD')),
                            typeName: 'INPATIENT',
                            appointmentStatus: 'CANCEL'
                        }, {
                            kind: 'DoD Appointment', // future and no appt status - YES
                            dateTime: globalTimeline._rightPad(futuredate2.format('YYYYMMDD')),
                            typeName: 'INPATIENT'
                        }, {
                            kind: 'DoD Appointment', //future and BOOKED - YES
                            dateTime: globalTimeline._rightPad(futuredate4.format('YYYYMMDD')),
                            typeName: 'INPATIENT',
                            appointmentStatus: 'BOOKED'
                        }]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'DoD Appointment',
                    dateTime: globalTimeline._rightPad(futuredate2.format('YYYYMMDD'))
                }, {
                    kind: 'DoD Appointment', //future and BOOKED - YES
                    dateTime: globalTimeline._rightPad(futuredate4.format('YYYYMMDD'))
                }, {
                    kind: 'DoD Appointment',
                    dateTime: globalTimeline._rightPad(futuredate.format('YYYYMMDD'))
                }],
                outpatient: [],
                inpatientCount: 3,
                outpatientCount: 0
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        //consults dropped from parsing 2/18/15
        it('correctly drops consults', function() {
            var JDSresults = {
                procedures: {
                    data: {
                        items: [{
                            kind: 'Consult',
                            dateTime: '19990000000000',
                            patientClassCode: 'urn:va:patient-class:IMP'
                        }, {
                            kind: 'Consult',
                            dateTime: '19950000000000',
                        }, {
                            kind: 'Consult',
                            dateTime: '19960000000000',
                            patientClassCode: 'urn:va:patient-class:AMB'
                        }, ]
                    }
                }
            };
            var expected = {
                inpatient: [],
                outpatient: [],
                inpatientCount: 0,
                outpatientCount: 0
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        //consults dropped from parsing 2/18/15 - test no longer runs
        xit('correctly sorts consults', function() {
            var JDSresults = {
                procedures: {
                    data: {
                        items: [{
                            kind: 'Consult',
                            dateTime: '19990000000000',
                            patientClassCode: 'urn:va:patient-class:IMP'
                        }, {
                            kind: 'Consult',
                            dateTime: '19950000000000',
                        }, {
                            kind: 'Consult',
                            dateTime: '19960000000000',
                            patientClassCode: 'urn:va:patient-class:AMB'
                        }, ]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'Consult',
                    dateTime: '19990000000000'
                }],
                outpatient: [{
                    kind: 'Consult',
                    dateTime: '19950000000000'
                }, {
                    kind: 'Consult',
                    dateTime: '19960000000000'
                }],
                inpatientCount: 1,
                outpatientCount: 2
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

        xit('correctly sorts procedure/image data', function() {
            var JDSresults = {
                encounters: {
                    data: {
                        items: [{
                            kind: 'Admission',
                            dateTime: '19940000000000',
                            patientClassCode: 'urn:va:patient-class:IMP',
                            uid: '456'
                        }, {
                            kind: 'Visit',
                            dateTime: '19950000000000',
                            patientClassCode: 'urn:va:patient-class:AMB',
                            uid: '123'
                        }]
                    }
                },
                procedures: {
                    data: {
                        items: [{
                            kind: 'Imaging',
                            dateTime: '19950000000000',
                            encounterUid: '123'
                        }, {
                            kind: 'Radiology',
                            dateTime: '19960000000000',
                            encounterUid: '456'
                        }, {
                            kind: 'Procedure',
                            dateTime: '19960000000000',
                            encounterUid: 'fakeUID'
                        }, {
                            kind: 'Surgery'
                        }]
                    }
                }
            };
            var expected = {
                inpatient: [{
                    kind: 'Admission',
                    dateTime: '19940000000000'
                }, {
                    kind: 'Radiology',
                    dateTime: '19960000000000'
                }],
                outpatient: [{
                    kind: 'Visit',
                    dateTime: '19950000000000'
                }, {
                    kind: 'Imaging',
                    dateTime: '19950000000000'
                }],
                inpatientCount: 2,
                outpatientCount: 2
            };
            var result = globalTimeline._sortInpatientOutpatient(JDSresults, null);
            expect(result).toEqual(expected);
        });

    });


});
