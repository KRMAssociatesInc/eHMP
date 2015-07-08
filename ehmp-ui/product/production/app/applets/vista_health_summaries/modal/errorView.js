define([
    "backbone",
    "marionette",
    "hbs!app/applets/vista_health_summaries/modal/errorTemplate"
], function(Backbone, Marionette, ErrorTemplate) {
    'use strict';

    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: ErrorTemplate
    });

    return ErrorView;
});
