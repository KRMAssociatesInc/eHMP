/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

/* combining Stack Overflow answers from Darshan Sawardekar and nikoshr
 * to use partial templates given in the content (instead of the options);
 * takes advantage of hbs */
'use strict';

define(['handlebars'], function (Handlebars) {
	function usePartial (template, context, options) {
		if (!template || typeof template !== "function") {
			console.log('handlebars usePartial helper error: check given hbs!template');
			return '';
		} else {
			return new Handlebars.SafeString( template(context) );
		}
	}

	Handlebars.registerHelper('usePartial', usePartial);
	return usePartial;
});