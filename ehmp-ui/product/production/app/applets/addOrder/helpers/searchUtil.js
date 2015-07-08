define([
    'backbone',
    'marionette'
], function(Backbone, Marionette) {
    var searchUtil = {


        enableLoadingIndicator: function(isEnabled) {
            if (isEnabled) {
                $('#meds-loading-indicator').show();
            } else {
                $('#meds-loading-indicator').hide();
                $('#meds-loading-indicator').focus();
            }
        },

        escapeHtml: function(string) {
            var entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '/': '&#x2F;'
            };
            return String(string).replace(/[&<>"'\/]/g, function(s) {
                return entityMap[s];
            });
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
    return searchUtil;
});
