define([
    "backbone",
    "hbs!app/applets/newsfeed/visitDetail/visitDetailTemplate",
], function(Backbone, visitDetailTemplate) {
    return Backbone.Marionette.ItemView.extend({
        template: visitDetailTemplate
    });
});
