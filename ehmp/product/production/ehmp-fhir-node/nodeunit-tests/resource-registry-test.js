var assert = require('assert');
var ResourceRegistry = require('../modules/resourceDirectory/resourceRegistry');

exports.registerSingle = function(test) {
	var registry = new ResourceRegistry();
	assert.equal(0, registry.getResources().length);
	registry.register({
		title: 't1',
		href: 'l1'
	});
	assert.equal(1, registry.getResources().length);
	test.done();
};

exports.registerMultiple = function(test) {
	var registry = new ResourceRegistry();
	assert.equal(0, registry.getResources().length);
	registry.register({
		title: 't1',
		href: 'l1'
	});
	registry.register({
		title: 't2',
		href: 'l2'
	});
	assert.equal(2, registry.getResources().length);
	test.done();
};

exports.mustSpecifyTitleInRegistry = function(test) {
	var registry = new ResourceRegistry();
	assert.equal(0, registry.getResources().length);
	test.throws(
		function() {
			registry.register({
				href: 'l1'
			});
		}, Error, 'Should throw exception if attempt to add resource without a title'
	);
	test.done();
};

exports.mustSpecifyHrefInRegistry = function(test) {
	var registry = new ResourceRegistry();
	assert.equal(0, registry.getResources().length);
	test.throws(
		function() {
			registry.register({
				title: 't1'
			});
		}, Error, 'Should throw exception if attempt to add resource without a href'
	);
	test.done();
};

exports.resourceDirectoryDoesNotContainOtherFields = function(test) {
	var registry = new ResourceRegistry();
	assert.equal(0, registry.getResources().length);
	registry.register({
		title: 't1',
		href: 'l1',
		custom1: 'x'
	});
	registry.register({
		title: 't2',
		href: 'l2',
		custom2: 'x'
	});

	var directory = registry.getDirectory();
	assert.ok(directory[0].title);
	assert.ok(directory[0].href);
	assert.ok(!(directory[0].custom1));

	assert.ok(directory[1].title);
	assert.ok(directory[1].href);
	assert.ok(!(directory[1].custom2));

	test.done();
};
