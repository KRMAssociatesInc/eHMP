define([
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/common/blankTemplate"
], function(Backbone, Marionette, blankTemplate) {

    var BlankView = Backbone.Marionette.ItemView.extend({
        template: blankTemplate
    });

    return BlankView;

});
