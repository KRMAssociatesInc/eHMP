define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/ccd_grid/utilParse'
], function(Backbone, Marionette, _, Util) {
    "use strict";

    Util.getResultedTimeFormatted = function(response) {
        response.resultedTimeFormatted = '';
        if (response.resulted) {
            response.resultedTimeFormatted = ADK.utils.formatDate(response.resulted, 'HH:mm');
        }
        return response;
    };

    return Util;
});
