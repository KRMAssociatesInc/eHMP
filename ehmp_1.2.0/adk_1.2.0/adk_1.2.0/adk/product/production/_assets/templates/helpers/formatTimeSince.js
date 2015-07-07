/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */
'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function formatTimeSince(dateString, showMinutes) {
        var startDate = moment(dateString, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD HH:mm:ss');
        var endDate = moment();
        var duration = moment.duration(endDate.diff(startDate));

        var years = parseFloat(duration.asYears());
        var days = parseFloat(duration.asDays());
        var months = parseFloat(duration.asMonths());
        var hours = parseFloat(duration.asHours());
        var min = parseFloat(duration.asMinutes());

        var lYear = 'y';
        var lMonth = 'm';
        var lDay = 'd';
        var lHour = 'h';
        var lMin = '\'';
        var finalResult = '';
        var count = 1;
        if (min >= 0 && min < 60) {
            finalResult = '< ' + count + lHour;
            if (showMinutes !== undefined && showMinutes === true) {
                count = Math.round(min);
                finalResult = count + lMin;
            }

        } else if (days < 2) {
            count = Math.floor(hours);
            finalResult = count + lHour;
        } else if ((days >= 2) && (days <= 60)) {
            count = Math.floor(days);
            finalResult = count + lDay;
        } else if ((months < 24) && (days > 60)) {
            count = Math.floor(months);
            finalResult = count + lMonth;
        } else if (months >= 24) {
            count = Math.floor(years);
            finalResult = count + lYear;
        }
        return finalResult;
    }
    Handlebars.registerHelper('formatTimeSince', formatTimeSince);
    return formatTimeSince;
});