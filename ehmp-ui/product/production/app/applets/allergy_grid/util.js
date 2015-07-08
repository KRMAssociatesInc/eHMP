define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/allergy_grid/utilParse'
], function(Backbone, Marionette, _, util) {
    "use strict";
    var Util = util || {};

    Util.getModalTitle = function(model) {
        return 'Allergen - ' + model.get('summary');
    };

    Util.getOriginatedFormatted = function(response) {
        response.originatedFormatted = '';
        if (response.originated) {
            response.originatedFormatted = ADK.utils.formatDate(response.originated, "MM/DD/YYYY - HH:mm");
        }
        return response;
    };

    return Util;
});
