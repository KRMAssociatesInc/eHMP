'use strict';

//------------------------------------------------------------------------------------
// This module contains map functions.
//
// Author: Les Westberg
//-------------------------------------------------------------------------------------

require('../env-setup');
var _ = require('underscore');

function filteredMap(collection, iterator, excludedValues) {
	if (!_.isArray(collection)  && !_.isObject(collection)) {
		collection = [collection];
	}
	if (!_.isArray(excludedValues)) {
		excludedValues = [excludedValues];
	}
	var theMap = _.map(collection, iterator);
	var theFilteredMap = _.filter(theMap, function(item) {
		return (! _.contains(excludedValues, item));
	});
	return theFilteredMap;
}

/*
iterates through an array or object applies the iterator to
each value. Then the function returns an object whose keys
are the values returned by the iterator with a count of the
number of times that value was returned.

Note that if _.isEmpty(collection) === true, then this function
returns an empty object.

if iterator is null or undefined, then an identity function will
be used.
*/
function counts(collection, iterator) {
	if(_.isEmpty(collection)) {
		return {};
	}

	if(_.isUndefined(iterator) || _.isNull(iterator)) {
		iterator = _.identity;
	}

	var obj = {};
	var val;

	_.each(collection, function(value, key, context) {
		val = iterator(value, key, context);
		if(!_.has(obj, val)) {
			obj[val] = 0;
		}

		obj[val]++;
	});

	return obj;
}

module.exports.filteredMap = filteredMap;
module.exports.counts = counts;

