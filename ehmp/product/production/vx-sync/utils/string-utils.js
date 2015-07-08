'use strict';

//----------------------------------------------------------------------------------
//  This module contains string manipulation utilities.
//
// Author: Les Westberg
//-----------------------------------------------------------------------------------

var _ = require('underscore');

//----------------------------------------------------------------------------------------
// This method left pads a number or string with the given character - so that the result
// is always the stringSize in size.
//
// theValue: The number or string to be padded.
// stringSize: The desired size of the string when we are done.
// padChar: The character to use in the padding.
// returns: The padded string.
//----------------------------------------------------------------------------------------
function leftPad(theValue, stringSize, padChar) {
	var sValue = '';

	if (typeof theValue === 'number') {
		sValue = String(theValue);
	} else if (typeof theValue === 'string') {
		sValue = theValue;
	}

	if (stringSize <= sValue.length) {
		return sValue;
	}

	var iNumPad = stringSize - sValue.length;
	var pad = '';
	_.times(iNumPad, function() {
		pad += padChar;
	});
	return pad + sValue;
}

//------------------------------------------------------------------------------------------
// This function will slice a partion of the string and parse it to an int in a null-safe
// way.
//
// s: The string to be parsed.
// start: The starting point to parse.
// end: The ending character position.
// returns: The int value that was parsed.
//------------------------------------------------------------------------------------------
function nullSafeSliceAndParseInt(s, start, end) {
	if ((s === null) || (s === undefined) || (typeof s !== 'string')) {
		return null;
	}

	var v = s.slice(start, end);
	if (!_.isFinite(v)) {
		return null;
	}
	return parseInt(v);
}

module.exports.leftPad = leftPad;
module.exports.nullSafeSliceAndParseInt = nullSafeSliceAndParseInt;