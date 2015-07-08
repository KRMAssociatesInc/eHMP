define([
    'backbone',
    'marionette',
    'hbs!app/applets/addOrder/templates/nonformularyTemplate',
], function(Backbone, Marionette, nonformularyTemplate) {
    'use strict';
    var NonformularyView;

    NonformularyView = Backbone.Marionette.ItemView.extend({
        template: nonformularyTemplate,
        className: 'text-center',
        initialize: function(options) {
            this.options = options;
            this.parentView = options.parentView;
        },
        events: {
            'click #ok': 'acknowledgeNonforumulary'
        },
        acknowledgeNonforumulary: function(e) {
            e.preventDefault();
            this.parentView.searchMedsRegion.$el.show();
            this.parentView.warningRegion.reset();
        }

    });

    return NonformularyView;
});
