'use strict';

require('../../../env-setup');

var Delay = require(global.VX_JOBFRAMEWORK + 'Delay');

var initMillis = 1000;
var maxMillis = 15000;
var incMillis = 1000;

var config = {
	initMillis: initMillis,
	maxMillis: maxMillis,
	incMillis: incMillis
};

describe('Delay.js', function() {
	describe('Delay()', function() {
		it('call with three params', function() {
			var delay = new Delay(initMillis, maxMillis, incMillis);
			expect(delay.initialMillis).toEqual(initMillis);
			expect(delay.maximumMillis).toEqual(maxMillis);
			expect(delay.incrementMillis).toEqual(incMillis);
			expect(delay.currentMillis).toEqual(initMillis);
		});

		it('call with config object', function() {
			var delay = new Delay(config);
			expect(delay.initialMillis).toEqual(initMillis);
			expect(delay.maximumMillis).toEqual(maxMillis);
			expect(delay.incrementMillis).toEqual(incMillis);
			expect(delay.currentMillis).toEqual(initMillis);
		});

		it('call as function with three params', function() {
			/* jshint ignore:start */
			var delay = Delay(initMillis, maxMillis, incMillis);
			expect(delay.initialMillis).toEqual(initMillis);
			expect(delay.maximumMillis).toEqual(maxMillis);
			expect(delay.incrementMillis).toEqual(incMillis);
			expect(delay.currentMillis).toEqual(initMillis);
			/* jshint ignore:end */
		});

		it('call as function with config object', function() {
			/* jshint ignore:start */
			var delay = Delay(config);
			expect(delay.initialMillis).toEqual(initMillis);
			expect(delay.maximumMillis).toEqual(maxMillis);
			expect(delay.incrementMillis).toEqual(incMillis);
			expect(delay.currentMillis).toEqual(initMillis);
			/* jshint ignore:end */
		});
	});

	describe('increment()', function() {
		it('currentMillis incremented by incMillis', function() {
			var delay = new Delay(config);
			delay.increment();
			expect(delay.initialMillis).toEqual(initMillis);
			expect(delay.maximumMillis).toEqual(maxMillis);
			expect(delay.incrementMillis).toEqual(incMillis);
			expect(delay.currentMillis).toEqual(initMillis + incMillis);
		});
	});

	describe('reset()', function() {
		it('currentMillis reset to initMillis', function() {
			var delay = new Delay(initMillis, maxMillis, incMillis);
			delay.increment();
			delay.increment();
			expect(delay.currentMillis).not.toEqual(initMillis);

			delay.reset();
			expect(delay.initialMillis).toEqual(initMillis);
			expect(delay.maximumMillis).toEqual(maxMillis);
			expect(delay.incrementMillis).toEqual(incMillis);
			expect(delay.currentMillis).toEqual(initMillis);
		});
	});
});