/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars'], function(Handlebars, moment) {
    function toLowerCase(string) {
        return string ? string.toLowerCase() : null;
    }

    Handlebars.registerHelper('toLowerCase', toLowerCase);
    return toLowerCase;
});