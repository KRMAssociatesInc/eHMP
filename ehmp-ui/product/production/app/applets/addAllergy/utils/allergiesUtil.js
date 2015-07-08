define([
    "backbone",
    "marionette",
    "underscore",
    "moment"
], function(Backbone, Marionette, _, Moment) {
    var allergiesUtil = {

        currentRdkEventDate: function() {
            return new Moment().format("YYYYMMDD");
        },

        currentRdkEventTime: function() {
            return new Moment().format("HHmm") + "00";
        },

        rdkObservedTimestampFromDateString: function(dateString) {
            return new Moment(dateString, ADK.utils.dateUtils.defaultOptions().placeholder).format("YYYYMMDD");
        },

        rdkObservedTimestampFromDateTimeStrings: function(date, time) {
            var input = new Moment(date + ' ' + time + 'm');
            if (!input.isValid()) {
                return 0;
            } else {
                return input.format('YYYYMMDDHHmm');
            }
        },

        enableLoadingIndicator: function(isEnabled) {
            if (isEnabled) {
                $("#allergensLoadingIndicator").show();
            } else {
                $("#allergensLoadingIndicator").hide();
                $('#allergenSearchInput').focus();
            }
        },

        /*
         * This function monitors the time between keystrokes of a target in
         * the provided <event>. If the time between the keystrokes is more
         * than the provided <timeThreshold>, then the <callback> function is
         * called. Additionally, a <characterThreshold> can be provided where
         * the user must type at least the <characterThreshold> amount of
         * characters before the <callback> function is called.
         *
         * @param event: The event that triggered the keystroke monitor
         * @param eventType: A string containing the event type. Used so that
         *                   if the event does not match the event type then
         *                   the function is returned
         * @param characterThreshold: An integer used to determine one minus the
         *                            minimum how many characters a user must
         *                            type to trigger the callback function
         * @param timeThreshold: Milliseconds as an integer used to set the
         *                       timeout between keystrokes
         * @param callback: The callback function to be executed once the
                            once the timeout has occurred
         */
        performActionWhileTyping: function(event, eventType, characterThreshold, timeThreshold, callback) {
            if (event.type !== eventType) {
                return;
            }

            if ($(event.target).val().length <= characterThreshold && typeof timeoutHandle !== 'undefined') {
                clearTimeout(timeoutHandle);
            } else if ($(event.target).val().length > characterThreshold) {
                if (typeof timeoutHandle === 'undefined') {
                    timeoutHandle = _.delay(callback, timeThreshold, event);
                } else {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = _.delay(callback, timeThreshold, event);
                }
            }
        }
    };
    return allergiesUtil;
});
