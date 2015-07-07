'use strict';

//---------------------------------------------------------------------
// This wraps the node namecase utility to fix some issues with what
// it returns.
//
// Author: Les Westberg
//---------------------------------------------------------------------

var _ = require('underscore');
var nc = require('namecase');

function namecase (text) {
	if ((text === null) || (text === undefined)) {
		return null;
	}

	if (typeof text !== 'string') {
		return text;
	}

	var ncText = nc(text);

	// Fix the case where the word immediately following a comma was not upper cased.
	//--------------------------------------------------------------------------------
	var tokens = ncText.split(',');
	if ((tokens) && (tokens.length > 1)) {
		var fixedTokens = _.map(tokens, function(token) {
			return token && token[0].toUpperCase() + token.slice(1);
		});

		ncText = fixedTokens.join(',');
	}

	// Now we need to fix any tokens that have a digit in them.  We should upper case all of those.
	//---------------------------------------------------------------------------------------------
	tokens = ncText.split(/[\s\W]/);
	if ((tokens) && (tokens.length >= 1)) {
		var tokensWithDigit = _.filter(tokens, function(token) {
			return (token.search(/[0-9]/) >= 0);
		});
		if (!_.isEmpty(tokensWithDigit)) {
			_.each(tokensWithDigit, function(tokenWithDigit) {
				ncText = ncText.replace(tokenWithDigit, tokenWithDigit.toUpperCase());
			});
		}
	}

	return ncText;

}

module.exports.namecase = namecase;