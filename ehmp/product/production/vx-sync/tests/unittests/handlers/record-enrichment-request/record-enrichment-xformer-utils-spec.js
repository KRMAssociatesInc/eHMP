'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-xformer-utils.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var recEnrichXformerUtil = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-xformer-utils');
var log = require(global.VX_UTILS + 'dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
// 	name: 'record-enrichment-xformer-utils-spec',
// 	level: 'debug'
// });


describe('record-enrichment-xformer-utils.js', function() {
	describe('getSummary()', function() {
		it('Happy Path', function() {
			var record = {
				uid: 'urn:va:allergy:9E7A:3:1'
			};
			var summary = recEnrichXformerUtil.getSummary('Allergy', record);
			expect(summary).toEqual('Allergy{uid=\'urn:va:allergy:9E7A:3:1\'}');
		});
		it('No summary name', function() {
			var record = {
				uid: 'urn:va:allergy:9E7A:3:1'
			};
			var summary = recEnrichXformerUtil.getSummary(null, record);
			expect(summary).toEqual('{uid=\'urn:va:allergy:9E7A:3:1\'}');
		});
		it('No record', function() {
			var summary = recEnrichXformerUtil.getSummary('Allergy', null);
			expect(summary).toEqual('');
		});
		it('No uid', function() {
			var summary = recEnrichXformerUtil.getSummary('Allergy', {});
			expect(summary).toEqual('Allergy{uid=\'\'}');
		});
	});

	describe('recordContainsCode()', function() {
		it('Code existed in record.', function() {
			var record = {
				uid: 'urn:va:allergy:9E7A:3:1',
				codes: [{
					code: 'someCode',
					system: 'SomeCodeSystem',
					display: 'Some Display Text'
				}, {
					code: 'someCode2',
					system: 'SomeCodeSystem2',
					display: 'Some Display Text 2'
				}, {
					code: 'someCode3',
					system: 'SomeCodeSystem3',
					display: 'Some Display Text 3'
				}]
			};
			var codeExists = recEnrichXformerUtil.recordContainsCode('SomeCodeSystem2', record);
			expect(codeExists).toEqual(true);
		});
		it('Record does not exist.', function() {
			var record = null;
			var codeExists = recEnrichXformerUtil.recordContainsCode('SomeCodeSystem2', record);
			expect(codeExists).toEqual(false);
		});
		it('record.codes does not exist.', function() {
			var record = {};
			var codeExists = recEnrichXformerUtil.recordContainsCode('SomeCodeSystem2', record);
			expect(codeExists).toEqual(false);
		});
		it('Code does not exist in record.', function() {
			var record = {
				uid: 'urn:va:allergy:9E7A:3:1',
				codes: [{
					code: 'someCode',
					system: 'SomeCodeSystem',
					display: 'Some Display Text'
				}, {
					code: 'someCode2',
					system: 'SomeCodeSystem2',
					display: 'Some Display Text 2'
				}, {
					code: 'someCode3',
					system: 'SomeCodeSystem3',
					display: 'Some Display Text 3'
				}]
			};
			var codeExists = recEnrichXformerUtil.recordContainsCode('SomeCodeSystem4', record);
			expect(codeExists).toEqual(false);
		});
	});

	describe('retrieveMappedTerminoloyCodeInfo()', function() {
		it('Record did not contain code - doing a terminology lookup.', function() {
			var record = {
				uid: 'urn:va:allergy:9E7A:3:1',
				codes: [{
					code: 'someCode',
					codeSystem: 'SomeCodeSystem',
					displayText: 'Some Display Text'
				}]
			};
			var jlvMappedCodeValue = {
				code: 'someCode2',
				codeSystem: 'SomeCodeSystem2',
				displayText: 'Some Display Text 2'
			};
			var terminologyUtils = {
				getJlvMappedCode: function(mappingType, sourceCode, callback) {
					return callback(null, jlvMappedCodeValue);
				}

			};

			var finished = false;
			runs(function() {
				recEnrichXformerUtil.retrieveMappedTerminoloyCodeInfo('SomeCodeSystem2', 'AllergyVUIDtoUMLSCui', 'SomeSourceCode', record, log, terminologyUtils, function(error, jlvMappedCode) {
					expect(error).toBeNull();
					expect(jlvMappedCode).toEqual(jlvMappedCodeValue);
					finished = true;

				});
			});

			waitsFor(function() {
				return finished;
			}, 'should be called', 100);
		});
		it('Record already contained code - doing a terminology lookup.', function() {
			var record = {
				uid: 'urn:va:allergy:9E7A:3:1',
				codes: [{
					code: 'someCode',
					system: 'SomeCodeSystem',
					display: 'Some Display Text'
				}, {
					code: 'someCode2',
					system: 'SomeCodeSystem2',
					display: 'Some Display Text 2'
				}]
			};
			var jlvMappedCodeValue = {
				code: 'someCode2',
				codeSystem: 'SomeCodeSystem2',
				displayText: 'Some Display Text 2'
			};
			var terminologyUtils = {
				getJlvMappedCode: function(mappingType, sourceCode, callback) {
					return callback('ThisShouldNeverHaveBeenCalled', jlvMappedCodeValue);
				}

			};

			var finished = false;
			runs(function() {
				recEnrichXformerUtil.retrieveMappedTerminoloyCodeInfo('SomeCodeSystem2', 'AllergyVUIDtoUMLSCui', 'SomeSourceCode', record, log, terminologyUtils, function(error, jlvMappedCode) {
					expect(error).toBeNull();
					expect(jlvMappedCode).toBeNull();
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			}, 'should be called', 100);
		});
	});
	describe('stripUrnFromVuid()', function() {
		it('vuid is a urn.', function() {
			var vuidUrn = 'urn:va:vuid:100';
			var vuid = recEnrichXformerUtil.stripUrnFromVuid(vuidUrn);
			expect(vuid).toEqual('100');
		});
		it('vuid is not urn.', function() {
			var vuidUrn = '100';
			var vuid = recEnrichXformerUtil.stripUrnFromVuid(vuidUrn);
			expect(vuid).toEqual('100');
		});
	});
	describe('convertMappedCodeToJdsCode()', function() {
		it('Mapped Code exists.', function() {
			var jlvMappedCode = {
				codeSystem: 'SomeCodeSystem',
				code: 'SomeCode',
				displayText: 'SomeText'
			};
			var jdsCode = recEnrichXformerUtil.convertMappedCodeToJdsCode(jlvMappedCode);
			expect(jdsCode).toBeTruthy();
			expect(jdsCode.system).toEqual(jlvMappedCode.codeSystem);
			expect(jdsCode.code).toEqual(jlvMappedCode.code);
			expect(jdsCode.display).toEqual(jlvMappedCode.displayText);
		});
		it('Mapped Code does not exist.', function() {
			var jlvMappedCode = null;
			var jdsCode = recEnrichXformerUtil.convertMappedCodeToJdsCode(jlvMappedCode);
			expect(jdsCode).toBeNull();
		});
	});
});