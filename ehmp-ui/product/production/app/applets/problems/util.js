define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/problems/utilParse'
], function(Backbone, Marionette, _, Util) {
    "use strict";
    Util.getOnsetFormatted = function(response) {
        if (response.onset) {
            if (response.onset.toString().length == 4) {
                response.onsetFormatted = ADK.utils.formatDate(response.onset, 'YYYY');
            }else {
                response.onsetFormatted = ADK.utils.formatDate(response.onset);
            }
        }
        return response;
    };

    Util.getUpdatedFormatted = function(response) {
        if (response.updated) {
            response.updatedFormatted = ADK.utils.formatDate(response.updated);
        }
        return response;
    };

    Util.getEnteredFormatted = function(response) {
        if (response.entered) {
            response.enteredFormatted = ADK.utils.formatDate(response.entered);
        }
        return response;
    };

    Util.getModalTitle = function(model) {
        return model.get('problemText');
    };
    return Util;
});
