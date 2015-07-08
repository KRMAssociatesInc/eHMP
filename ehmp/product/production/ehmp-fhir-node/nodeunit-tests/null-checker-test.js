var assert = require('assert');
var nullchecker = require('../modules/nullchecker');

exports.validValue = function(test) {
	var value = 'x';
	assert.equal(false, nullchecker.isNullish(value));
	test.done();
};

exports.checkNull = function(test) {
	var value = null;
	assert.equal(true, nullchecker.isNullish(value));
	test.done();
};

exports.neverSet = function(test) {
	var value;
	assert.equal(true, nullchecker.isNullish(value));
	test.done();
};

exports.undefined = function(test) {
	var o = {};
	assert.equal(true, nullchecker.isNullish(o.fieldThatDoesNotExist));
	test.done();
};
