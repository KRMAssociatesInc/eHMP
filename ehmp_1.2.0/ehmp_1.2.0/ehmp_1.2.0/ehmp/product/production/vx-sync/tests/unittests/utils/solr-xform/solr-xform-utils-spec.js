'use strict';

//-----------------------------------------------------------------
// This will test the solr-xform-utils.js functions.
//
// Author: Les Westberg
//-----------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');
var solrXformUtil = require(global.VX_UTILS + 'solr-xform/solr-xform-utils');

describe('solr-xform-utils.js', function() {
    describe('setSimpleFromSimple()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': true
            };
            solrXformUtil.setSimpleFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toBe(true);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.setSimpleFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setSimpleFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is undefined', function() {
            var solrRecord = {};
            var vprRecord = {};
            solrXformUtil.setSimpleFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': null
            };
            solrXformUtil.setSimpleFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
    });
    describe('setStringFromSimple()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.setStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toBe('testValue');
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': true
            };
            solrXformUtil.setStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toBe('true');
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': 100
            };
            solrXformUtil.setStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toBe('100');
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.setStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is not string', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': {}
            };
            solrXformUtil.setStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
    });
    describe('setStringFromValue()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            solrXformUtil.setStringFromValue(solrRecord, 'test', 'testValue');
            expect(solrRecord.test).toBe('testValue');
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            solrXformUtil.setStringFromValue(solrRecord, 'test', true);
            expect(solrRecord.test).toBe('true');
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            solrXformUtil.setStringFromValue(solrRecord, 'test', 100);
            expect(solrRecord.test).toBe('100');
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            solrXformUtil.setStringFromValue(solrRecord, 'test', 'testValue');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            solrXformUtil.setStringFromValue(solrRecord, 'test', null);
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is not string', function() {
            var solrRecord = {};
            solrXformUtil.setStringFromValue(solrRecord, 'test', {});
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
    });
    describe('addStringFromSimple()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.addStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toEqual(['testValue']);
        });
        it('Verify adding a valid value', function() {
            var solrRecord = {
                'test': ['testValue1']
            };
            var vprRecord = {
                'test': 'testValue2'
            };
            solrXformUtil.addStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toEqual(['testValue1', 'testValue2']);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.addStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.addStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is not string', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': 100
            };
            solrXformUtil.addStringFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
    });
    describe('setStringArrayFromSimple()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.setStringArrayFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toEqual(['testValue']);
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': true
            };
            solrXformUtil.setStringArrayFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toEqual(['true']);
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': 100
            };
            solrXformUtil.setStringArrayFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord.test).toEqual(['100']);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': 'testValue'
            };
            solrXformUtil.setStringArrayFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setStringArrayFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is not string', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': {}
            };
            solrXformUtil.setStringArrayFromSimple(solrRecord, 'test', vprRecord, 'test');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
    });
    describe('setStringArrayFromObjectArrayField()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    name: 'name1'
                }, {
                    name: 'name2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'test', vprRecord, 'test', 'name');
            expect(solrRecord.test).toEqual(['name1', 'name2']);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': [{
                    name: 'name1'
                }, {
                    name: 'name2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'test', vprRecord, 'test', 'name');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'test', vprRecord, 'test', 'name');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is null', function() {
            var solrRecord = {};
            var vprRecord = {};
            solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'test', vprRecord, 'test', 'name');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is an array where not all have the property we are looking for.', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    otherName: 'name1'
                }, {
                    name: 'name2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayField(solrRecord, 'test', vprRecord, 'test', 'name');
            expect(solrRecord.test).toEqual(['name2']);
        });
    });
    describe('setStringArrayFromObjectArrayFields()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    name: 'name1',
                    text: 'text1'
                }, {
                    name: 'name2',
                    text: 'text2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'test', vprRecord, 'test', 'name', 'text', ' ');
            expect(solrRecord.test).toEqual(['name1 text1', 'name2 text2']);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': [{
                    name: 'name1',
                    text: 'text1'
                }, {
                    name: 'name2',
                    text: 'text2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'test', vprRecord, 'test', 'name', 'text', ' ');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'test', vprRecord, 'test', 'name', 'text', ' ');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is null', function() {
            var solrRecord = {};
            var vprRecord = {};
            solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'test', vprRecord, 'test', 'name', 'text', ' ');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is an array where not all have the property we are looking for.', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    otherName: 'name1',
                    otherText: 'text1'
                }, {
                    name: 'name2',
                    text: 'text2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'test', vprRecord, 'test', 'name', 'text', ' ');
            expect(solrRecord.test).toEqual(['name2 text2']);
        });
        it('Verify vprRecord.field is an array where not all have the child properties are present.', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    name: 'name1'
                }, {
                    text: 'text2'
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayFields(solrRecord, 'test', vprRecord, 'test', 'name', 'text', ' ');
            expect(solrRecord.test).toEqual(['name1', 'text2']);
        });
    });
    describe('setStringArrayFromObjectArrayArrayField()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    'testChild': [{
                        name: 'name1'
                    }, {
                        name: 'name2'
                    }]
                }, {
                    'testChild': [{
                        name: 'name10'
                    }, {
                        name: 'name20'
                    }]
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(solrRecord.test).toEqual(['name1', 'name2', 'name10', 'name20']);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'test': [{
                    'testChild': [{
                        name: 'name1'
                    }, {
                        name: 'name2'
                    }]
                }, {
                    'testChild': [{
                        name: 'name10'
                    }, {
                        name: 'name20'
                    }]
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is null', function() {
            var solrRecord = {};
            var vprRecord = {};
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': []
            };
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    'testChild': []
                }, {
                    'testChild': []
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is an array where not all have the property we are looking for.', function() {
            var solrRecord = {};
            var vprRecord = {
                'test': [{
                    'testChild': [{
                        otherName: 'name1'
                    }, {
                        name: 'name2'
                    }]
                }, {
                    'otherTestChild': [{
                        name: 'name10'
                    }, {
                        name: 'name20'
                    }]
                }]
            };
            solrXformUtil.setStringArrayFromObjectArrayArrayField(solrRecord, 'test', vprRecord, 'test', 'testChild', 'name');
            expect(solrRecord.test).toEqual(['name2']);
        });
    });
    describe('setStringFromPrimaryProviders()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'providers': [{
                    providerName: 'name1'
                }, {
                    primary: true,
                    providerName: 'name2'
                }]
            };
            solrXformUtil.setStringFromPrimaryProviders(solrRecord, 'test', vprRecord, 'providers', 'providerName');
            expect(solrRecord.test).toEqual('name2');
        });
        it('Verify vprRecord has a primary provider - but no providerName there.', function() {
            var solrRecord = {};
            var vprRecord = {
                'providers': [{
                    providerName: 'name1'
                }, {
                    primary: true,
                }]
            };
            solrXformUtil.setStringFromPrimaryProviders(solrRecord, 'test', vprRecord, 'providers', 'providerName');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify solrRecord null', function() {
            var solrRecord = null;
            var vprRecord = {
                'providers': [{
                    providerName: 'name1'
                }, {
                    primary: true,
                    providerName: 'name2'
                }]
            };
            solrXformUtil.setStringFromPrimaryProviders(solrRecord, 'test', vprRecord, 'providers', 'providerName');
            expect(solrRecord).toBeNull();
        });
        it('Verify vprRecord null', function() {
            var solrRecord = {};
            var vprRecord = null;
            solrXformUtil.setStringFromPrimaryProviders(solrRecord, 'test', vprRecord, 'providers', 'providerName');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
        it('Verify vprRecord.field is null', function() {
            var solrRecord = {};
            var vprRecord = {};
            solrXformUtil.setStringFromPrimaryProviders(solrRecord, 'test', vprRecord, 'providers', 'providerName');
            expect(_.isEmpty(solrRecord)).toBe(true);
        });
    });
    describe('setCommonFields()', function() {
        it('Verify valid value', function() {
            var solrRecord = {};
            var vprRecord = {
                'uid': 'urn:va:allergy:9E7A:3:1',
                'pid': '9E7A;3',
                'facilityCode': '500',
                'facilityName': 'SomeFacility',
                'kind': 'SomeKind',
                'summary': 'SomeSummary',
                'codes': [{
                    'code': '100',
                    'system': 'http://theSystem100',
                    'display': 'SomeDisplay100'
                }, {
                    'code': '200',
                    'system': 'http://theSystem200',
                    'display': 'SomeDisplay200'
                }],
                'referenceDateTime': '20051010100001',
                'visitDateTime': '20051010100002',
                'observed': '20051010100003',
                'resulted': '20051010100004',
                'entered': '20051010100005',
                'updated': '20051010100006',
                'resolved': '20051010100007',
                'onset': '20051010100008',
                'stopped': '20051010100009',
                'overallStart': '20051010100010',
                'overallStop': '20051010100011',
                'administeredDateTime': '20051010100012',
                'procedureDateTime': '20051010100013',
                'start': '20051010100014',
                'healthFactorDateTime': '20051010100015',
                'documentEntered': '20051010100016',
                'obsEntered': '20051010100017',
                'verified': '20051010100018'
            };
            solrXformUtil.setCommonFields(solrRecord, vprRecord);
            expect(solrRecord.uid).toBe(vprRecord.uid);
            expect(solrRecord.pid).toBe(vprRecord.pid);
            expect(solrRecord.facility_code).toBe(vprRecord.facilityCode);
            expect(solrRecord.facility_name).toBe(vprRecord.facilityName);
            expect(solrRecord.kind).toBe(vprRecord.kind);
            expect(solrRecord.summary).toBe(vprRecord.summary);
            expect(solrRecord.codes_code).toEqual([vprRecord.codes[0].code, vprRecord.codes[1].code]);
            expect(solrRecord.codes_system).toEqual([vprRecord.codes[0].system, vprRecord.codes[1].system]);
            expect(solrRecord.codes_display).toEqual([vprRecord.codes[0].display, vprRecord.codes[1].display]);
            expect(solrRecord.reference_date_time).toBe(vprRecord.referenceDateTime);
            expect(solrRecord.visit_date_time).toBe(vprRecord.visitDateTime);
            expect(solrRecord.observed).toBe(vprRecord.observed);
            expect(solrRecord.resulted).toBe(vprRecord.resulted);
            expect(solrRecord.entered).toBe(vprRecord.entered);
            expect(solrRecord.updated).toBe(vprRecord.updated);
            expect(solrRecord.resolved).toBe(vprRecord.resolved);
            expect(solrRecord.onset).toBe(vprRecord.onset);
            expect(solrRecord.stopped).toBe(vprRecord.stopped);
            expect(solrRecord.overall_start).toBe(vprRecord.overallStart);
            expect(solrRecord.overall_stop).toBe(vprRecord.overallStop);
            expect(solrRecord.administered_date_time).toBe(vprRecord.administeredDateTime);
            expect(solrRecord.procedure_date_time).toBe(vprRecord.procedureDateTime);
            expect(solrRecord.order_start_date_time).toBe(vprRecord.start);
            expect(solrRecord.health_factor_date_time).toBe(vprRecord.healthFactorDateTime);
            expect(solrRecord.document_entered).toBe(vprRecord.documentEntered);
            expect(solrRecord.obs_entered).toBe(vprRecord.obsEntered);
        });
    });
});