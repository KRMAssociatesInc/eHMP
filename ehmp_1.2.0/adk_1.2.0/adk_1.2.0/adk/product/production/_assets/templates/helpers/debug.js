/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars'], function (Handlebars) {
    function debug(optionalValue) {
    	console.log("Current Context");
  		console.log("====================");
  		console.log(this);

  		if (optionalValue) {
    		console.log("Value");
    		console.log("====================");
    		console.log(optionalValue);
  		}
      return 'wtf';
  	}

    Handlebars.registerHelper('debug', debug);
    return debug;
});
