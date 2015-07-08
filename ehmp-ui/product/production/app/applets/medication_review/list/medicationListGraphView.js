define([
    "backbone",
    "marionette",
    "hbs!app/applets/medication_review/list/medicationListGraphTemplate"
], function(Backbone, Marionette, medicationListGraphTemplate) {

    var MedicationListGraphView = Backbone.Marionette.ItemView.extend({
        template: medicationListGraphTemplate
    });

    return MedicationListGraphView;
});
