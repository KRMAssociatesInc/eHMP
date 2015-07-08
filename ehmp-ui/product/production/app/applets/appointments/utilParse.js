define([
    'backbone',
    'marionette',
    'underscore',
], function(Backbone, Marionette, _) {
    "use strict";

    var Util = {};

    Util.getFormattedDisplayTypeName = function(response) {
        var formattedTypeName = '';
        if (response.typeDisplayName && response.typeDisplayName == 'Event (Historical)') {
            response.formattedTypeName = "Other";
        }else{
            response.formattedTypeName = response.typeDisplayName;
        }

        return response;
    };

    Util.getFacilityColor = function(response) {

        if (response.facilityCode && response.facilityCode == 'DOD') {
            response.facilityColor = 'DOD';
        } else {
            response.facilityColor = 'nonDOD';
        }

        return response;
    };

    Util.getModalTitle = function(model) {
        return model.get('typeDisplayName');
    };

    Util.getProviderDisplayName = function(response) {
        if (response.providers) {
            response.providerDisplayName = response.providers[0].providerDisplayName;
        }
        return response;
    };

    Util.getFormattedDecription = function(response) {
        if (response.categoryName) {
            if(response.categoryName == "Outpatient Visit"){
                response.formattedDescription = "VA Visit";
            }else{
                response.formattedDescription = response.categoryName;
            }
        }else{
            if (response.description && !response.categoryName) {
                response.formattedDescription = response.description;
            }
        }
        return response;
    };

    return Util;
});
