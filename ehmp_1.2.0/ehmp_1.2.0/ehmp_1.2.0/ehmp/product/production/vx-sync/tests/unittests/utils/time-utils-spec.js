'use strict';

require('../../../env-setup');

require('../../../env-setup');
var timeUtils = require(global.VX_UTILS + 'time-utils');

describe('time-utils.js', function() {
	describe('createStampTime()', function() {
		it('verify stampTime format', function() {});
		// 'YYYYMMDDHHmmss.SSS'
		expect(timeUtils.createStampTime()).toMatch(/[0-9]{14}/);
	});
});
