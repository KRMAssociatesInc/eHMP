'use strict';

var _ = require('underscore');

/*
Variadic Function
Functional Syntax:
getProperty(object, properties,...)
getProperty(object, properties,...)

Object Syntax:
util(object).getProperty(properties,...)
util(object).getProperty(properties,...)


This function "walks" down the list of properties given
for the object, returning the value of the last property
or undefined if any of the properties are not present.

Parameters:

object - the object being interrogated. If the value
passed for this parameter is undefined, null, or the
property does not exist, then the undefined is
returned.

properties - an array of property names. Note that can
include subscripts for arrays. If the value of this
parameter is undefined, null, an empty array, or an
empty string, then the function will pass the value
of the object parameter, or undefined if the value
of object is null or undefined.
*/
function getProperty(object, properties) {
    /* jshint ignore:start */
    if (this instanceof Instance) {
        properties = _.isArray(object) || properties === '' || _.isUndefined(properties) ? object : _.toArray(arguments);
        object = this.object;
    }
    /* jshint ignore:end */

    if (_.isUndefined(object) || _.isNull(object)) {
        return object;
    }

    if (_.isUndefined(properties) || _.isNull(properties) || properties === '' || _.isEqual(properties, [])) {
        return object;
    }

    if (arguments.length > 1 && !_.isArray(properties)) {
        properties = _.rest(arguments);
    }

    var value = object;
    _.find(properties, function(property) {
        if (!_.has(value, property)) {
            value = undefined;
            return true;
        }

        value = value[property];
        return false;
    });

    return value;
}

function removeProperty(obj, property){
	var localCopy = _.clone(obj);

  for (var p in localCopy) {

    if (localCopy.hasOwnProperty(p)) {

      if (p === property) {
        delete localCopy[p];

      } else if (typeof localCopy[p] === 'object') {
        removeProperty(localCopy[p], property);
      }
    }
  }
  return localCopy;
}


function util(object) {
    return new Instance(object);
}

function Instance(object) {
    this.object = object;
}

Instance.prototype.getProperty = getProperty;
Instance.prototype.removeProperty = removeProperty;

util.getProperty = getProperty;
util.removeProperty = removeProperty;

module.exports = util;