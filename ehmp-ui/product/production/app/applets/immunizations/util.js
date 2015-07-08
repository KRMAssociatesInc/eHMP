define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/immunizations/utilParse'
], function(Backbone, Marionette, _, Util) {
    "use strict";

    Util.getAdministeredFormatted = function(response) {
        if (response.administeredDateTime) {
            response.administeredFormatted = ADK.utils.formatDate(response.administeredDateTime);
        }
        return response;
    };

    Util.getNumericDate = function(response) {
        if (response.administeredDateTime) {
            response.numericDate = ADK.utils.formatDate(response.administeredDateTime, 'YYYYMMDD');
        }
        return response;
    };

    Util.getModalTitle = function(model) {
        return 'Vaccine - ' + model.get('name');
    };

    Util.getObservedFormatted = function(response) {
        response.observedFormatted = '';
        if (response.observed) {
            response.observedFormatted = ADK.utils.formatDate(response.observed);
        }
        return response;
    };

    Util.getObservedTimeFormatted = function(response) {
        response.observedTimeFormatted = '';
        if (response.observed) {
            response.observedTimeFormatted = ADK.utils.formatDate(response.observed, 'HH:mm');
        }
        return response;
    };

    Util.getResultedFormatted = function(response) {
        response.resultedFormatted = '';
        if (response.resulted) {
            response.resultedFormatted = ADK.utils.formatDate(response.resulted);
        }
        return response;
    };

    Util.getResultedTimeFormatted = function(response) {
        response.resultedTimeFormatted = '';
        if (response.resulted) {
            response.resultedTimeFormatted = ADK.utils.formatDate(response.resulted, 'HH:mm');
        }
        return response;
    };

    return Util;
});
