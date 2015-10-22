'use strict';

var _ = require('lodash');

/*
 Variadic Function:
 isNullish(object, properties...)
 isNullish(object)

 returns true if 'object' is Null or Undefined

 if one or more properties are passed, this function will
 do a 'short circuit' on each of them to see if any of
 them are undefined, with each being the parent of the next.

 For example:
 var obj = {
 x: {
 y: 'test'
 }
 };

 isNullish(obj, 'x', 'y'); // => false
 isNullish(obj, 'x', 'z'); // => true
 isNullish(obj, 'a', 'y'); // => true

 Note that in the case that 'object' is an array any values
 passed as properties will be treated as subscripts:

 var ary = ['test1', 'test2', 'test3'];

 console.log(isNullish(ary, '1')); // => false
 console.log(isNullish(ary, 1)); // => false
 console.log(isNullish(ary, '6')); // => true
 console.log(isNullish(ary, 6)); // => true
 console.log(isNullish(ary, 'a')); // => true

 Any non-string non-numeric value passed as 'properties' will cause
 this function to return true.
 */
function isNullish(object, properties) {
    if (_.isNull(object) || _.isUndefined(object) || object === '') {
        return true;
    }

    properties = _.rest(arguments);
    var context = object;

    return !_.every(properties, function(property) {
        if(isNullish(property)) {
            return false;
        }

        if(!_.isString(property) && !_.isFinite(property)) {
            return false;
        }

        if(_.has(context, property)) {
            context = context[property];
            return !_.isNull(context) && !_.isUndefined(context);
        }

        return false;
    });
}

//var isNullish = function(value) {
//    return value === undefined || value === null || value === '';
//};

var isNotNullish = function(value) {
    return !(isNullish.apply(null, arguments));
};

module.exports.isNullish = isNullish;
module.exports.isNotNullish = isNotNullish;
