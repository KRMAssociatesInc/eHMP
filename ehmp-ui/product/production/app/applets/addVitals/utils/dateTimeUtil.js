define([
    "backbone",
    "marionette",
    "underscore",
    "moment"
], function(Backbone, Marionette, _, Moment) {
    var dateTimeUtil = {

        currentObservedDateString: function() {
            return new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder);
        },

        currentObservedTimeString: function() {
            var mdt = new Moment(new Date()).format("hh:mm a");
            //cut off the final m
            return mdt.slice(0, -1);
        },

        getDateString: function(date) {
            return new Moment(date).format(ADK.utils.dateUtils.defaultOptions().placeholder);
        },

        requiredDateFormat: function(userValue) {
            var valid = true;
            var matches = userValue.match(ADK.utils.dateUtils.defaultOptions().regex);
            if (matches === null) {
                return false;
            }
            return true;
        },

        requiredTimeFormat: function(userValue) {
            var matches = userValue.match(/^([0][1-9]|[1][0-2]):([0-5]\d) (a|p)$/);
            if (matches === null) {
                return false;
            }
            return true;
        },

        futureDate: function(dateString, timeString) {
            var dateTimeString = dateString + ' ' + timeString + 'm',
                userDate = new Moment(dateTimeString),
                currDate = new Moment();
            return userDate.isAfter(currDate);
        },

        getSaveDate: function(date, time) {
            var input = date + ' ' + time + 'm';
            var mom = new Moment(input);
            if (!mom.isValid()) {
                return 0;
            } else {
                //return mom.format('YYYYMMDD HHmm');
                return ADK.utils.dateUtils.getRdkDateTimeFormatter().getDateTimeFromDateTimeStrings(date, time);
            }
        },

        pad: function(str) {
            return ("00" + str).slice(-2);
        }
    };
    return dateTimeUtil;
});
