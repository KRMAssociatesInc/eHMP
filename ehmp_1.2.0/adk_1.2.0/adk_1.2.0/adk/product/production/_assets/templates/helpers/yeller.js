/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars'], function (Handlebars) {
    function yeller(context, options) {
        // Assume it's a string for simplicity.
        return context + "!!!!!!!!";
    }

    Handlebars.registerHelper('yeller', yeller);
    return yeller;
});
