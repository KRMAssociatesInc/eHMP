define([
    "backbone",
    "marionette",
    "hbs!app/applets/lab_results_grid/modal/errorTemplate"
], function(Backbone, Marionette, ErrorTemplate) {
    'use strict';

    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: ErrorTemplate
    });

    return ErrorView;
});
