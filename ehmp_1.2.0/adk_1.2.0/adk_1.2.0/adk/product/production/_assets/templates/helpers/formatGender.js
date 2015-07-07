/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars'], function (Handlebars) {
	function formatGender(gender, format) {
		if (!gender) {
			return '';
		}

		var genderFormats = {
			single: gender.charAt(0),
			lowercase: gender.toLowerCase(),
			titlecase: (function(str) {
				return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
			})(gender),
			uppercase: gender.toUpperCase()
		};
		return genderFormats[format];
    }

    Handlebars.registerHelper('formatGender', formatGender);
    return formatGender;
});
