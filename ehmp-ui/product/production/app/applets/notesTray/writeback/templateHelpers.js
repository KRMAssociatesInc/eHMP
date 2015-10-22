define(['handlebars', 'moment'], function(Handlebars, moment) {
    'use strict';

    var templateHelpers = {
        formatRelativeTime: function(dateString) {
            if (dateString) {
                // the moment 2.10.5+ way:
                // return moment(dateString, 'YYYYMMDDHHmmss').calendar(null, {
                //     sameDay: '[Today at] HH:mm',
                //     nextDay: '[Tomorrow at] HH:mm',
                //     nextWeek: 'dddd [at] HH:mm',
                //     lastDay: '[Yesterday at] HH:mm',
                //     lastWeek: '[Last] dddd [at] HH:mm'
                // });

                // the moment 2.7 way:
                var calendarString = moment(dateString, 'YYYYMMDDHHmmss').calendar();
                var match = calendarString.match(/AM|PM$/);
                if (match && match.length === 1) {
                    var twelveHourTime = calendarString.substring(calendarString.length - 8).trim();
                    twelveHourTime = moment(twelveHourTime, 'h:mm a').format('HH:mm');
                    calendarString = calendarString.substring(0, calendarString.length - 8) + ' ' + twelveHourTime;
                }
                return calendarString;
            }
            return '';
        }
    };
    return templateHelpers;
});