/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function formatDate(date, displayFormat, sourceFormat) {

        if ($.isPlainObject(displayFormat)) {
            displayFormat = "MM/DD/YYYY";
            sourceFormat = "YYYYMMDDHHmmssSSS";
        } else if ($.isPlainObject(sourceFormat)) {
            sourceFormat = "YYYYMMDDHHmmssSSS";
        }


        if (date) {
            return moment(date, sourceFormat).format(displayFormat);
        } else {
            return '';
        }

    }

    Handlebars.registerHelper('formatDate', formatDate);
    return formatDate;
});