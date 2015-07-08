define([
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/common/loadingTemplate"
], function(Backbone, Marionette, loadingTemplate) {

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: loadingTemplate
    });

    return LoadingView;

});
