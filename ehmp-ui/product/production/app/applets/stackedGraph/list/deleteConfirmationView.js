define([
    'backbone',
    'marionette',
    'hbs!app/applets/stackedGraph/list/deleteConfirmationViewTemplate'
], function(Backbone, Marionette, ConfirmationViewTemplate) {

    return Backbone.Marionette.ItemView.extend({
        template: ConfirmationViewTemplate,
        events: {
            'click .deleteButton': 'yes',
            'click .cancelButton': 'no'
        },
        initialize: function(options) {
            this.options = options;
            this.model = new Backbone.Model();
            this.model.set({
                graphTitle: this.options.graphTitle
            });
        },
        yes: function() {
            this.options.callback();
        },
        no: function() {}
    });
});