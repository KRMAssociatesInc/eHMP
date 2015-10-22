/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function formatDateTime(dateTime, source, display) {
        if (display == "datetime") {
            display = 'MM/DD/YYYY - HH:mm';
        } else if (display == "date") {
            display = 'MM/DD/YYYY';
        }
        return moment(dateTime, source).format(display);
    }

    Handlebars.registerHelper('formatDateTime', formatDateTime);
    return formatDateTime;
});