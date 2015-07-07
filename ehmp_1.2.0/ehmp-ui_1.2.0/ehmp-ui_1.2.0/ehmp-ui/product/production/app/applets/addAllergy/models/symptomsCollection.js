define([
    "underscore",
    "moment",
    "app/applets/addAllergy/utils/validation",
    "app/applets/addAllergy/utils/symptomsUtil",
], function(_, Moment, Validation, SymptomsUtil) {
    'use strict';

    var SymptomsCollection = Backbone.Collection.extend({
        url: ADK.ResourceService.buildUrl('allergy-op-data-symptoms'),
        options: {
            reset: true,
            error: function(collection, resp) {
                collection.showError(resp.responseText);
                SymptomsUtil.enableLoadingIndictor(false);
                isFetching = false;
            },
        },
        isValid: function() {
            var valid = true;
            _.each(this.models, function(model) {
                if (!model.isValid()) {
                    valid = false;
                }
            });
            return valid;
        }
    });

    return SymptomsCollection;

});
