/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function stringCleanUp(string) {
        return string.replace(/\s+/g," ").replace(/(\r\n|\n|\r)/gm," ");
    }

    Handlebars.registerHelper('stringCleanUp', stringCleanUp);
    return stringCleanUp;
});