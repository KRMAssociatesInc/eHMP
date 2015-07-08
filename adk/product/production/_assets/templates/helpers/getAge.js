/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function getAge(dob, sourceFormat) {

        if ($.isPlainObject(sourceFormat)) {
            sourceFormat = "YYYYMMDDHHmmssSSS";
        }


        if (dob) {
            var dobString = moment(dob, sourceFormat);
            return moment().diff(dobString, 'years');
        } else {
            return '';
        }

    };

    Handlebars.registerHelper('getAge', getAge);
    return getAge;
});