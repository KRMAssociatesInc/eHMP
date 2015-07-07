define([
    "backbone",
    "marionette",
    "underscore",
], function(Backbone, Marionette, _) {
    'use strict';
    return {
        addIdCountToModel: function(collection, startIndex) {
            var i = startIndex;
            collection.each(function(model) {
                model.set('count', i);
                i++;
            });
        },
        isSelectedSymptomsEmpty: function() {
            return $('#symptoms-selected-tbl').children().length === 0 || $('#symptoms-selected-tbl > tbody').children().length === 0;
        },
        isSymptomsListEmpty: function() {
            return $('#symptoms-ul').children().length === 0;
        },
        enableLoadingIndictor: function(isEnabled) {
            if (isEnabled) {
                $("#symptomsLoadingIndicator").show();
            } else {
                $("#symptomsLoadingIndicator").hide();
                $('#symptomSearchInput').focus();
            }
        }
    };
});
