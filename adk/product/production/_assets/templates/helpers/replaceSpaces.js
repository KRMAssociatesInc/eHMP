/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

/**
 * Replace spaces with _, useful for templating ids.
 */
define(['handlebars'], function (Handlebars) {
    function replaceSpaces(string) {
        if(string !== undefined)
            return string.replace(" ", "_");

        return string;
    }

    Handlebars.registerHelper('replaceSpaces', replaceSpaces);
    return replaceSpaces;
});
