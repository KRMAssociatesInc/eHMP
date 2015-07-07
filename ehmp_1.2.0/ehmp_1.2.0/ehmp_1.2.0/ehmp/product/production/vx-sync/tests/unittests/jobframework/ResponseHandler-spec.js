'use strict';

require('../../../env-setup');

var ResponseHandler = require(global.VX_JOBFRAMEWORK + 'ResponseHandler');
var logger = require(global.VX_UTILS + 'dummy-logger');

describe('ResponseHandler.js', function() {
	describe('ResponseHandler()', function() {
		it('Verify ResponseHandler() called as function returns object', function() {
			/* jshint ignore:start */
			var expectedResponse = 'USING';
			var handler = ResponseHandler(logger, expectedResponse);
			expect(handler instanceof ResponseHandler).toBe(true);

			expect(handler.logger).toBe(logger);
			expect(handler.expectedResponse).toBe(expectedResponse);
			/* jshint ignore:end */
		});
	});

	describe('reset()', function() {});

	describe('process()', function() {});

	describe('parseBody()', function() {});

	describe('findInBuffer()', function() {});
});
