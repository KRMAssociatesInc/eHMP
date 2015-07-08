define([
    "backbone",
    "marionette",
    "hbs!app/applets/medication_review_v2/templates/ordersTemplate"
], function(Backbone, Marionette, ordersTemplate) {

    var OrderDetailView = Backbone.Marionette.ItemView.extend({
        template: ordersTemplate,
        // className: "detail-panel-item row-layout"
    });

    return OrderDetailView;
});