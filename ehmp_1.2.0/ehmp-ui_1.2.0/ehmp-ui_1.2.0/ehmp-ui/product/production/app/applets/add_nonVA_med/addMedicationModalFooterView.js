define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/add_nonVA_med/addMedicationModalFooterViewTemplate",
    "app/applets/add_nonVA_med/utils/util"
], function(Backbone, Marionette, _, addMedicationModalFooterViewTemplate, util) {
    'use strict';

    return Backbone.Marionette.ItemView.extend({
        className: 'add-medication-styles',
        template: addMedicationModalFooterViewTemplate,
        events: {
            'click #btn-add-non-va-med-accept': 'saveMed',
            'click #btn-add-non-va-med-back' : 'goBack'
        },
        saveMed: function() {
            $('#btn-add-non-va-med-accept').html("<i class='fa fa-spinner fa-spin'></i> <span> Saving...</span>");
            $('#btn-add-non-va-med-accept').addClass('disabled').attr('disabled');
            util.saveMed();
        }
    });
});
