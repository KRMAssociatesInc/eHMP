define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/allergy_grid/details/detailsTemplate"
], function(Backbone, Marionette, _, detailsTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: detailsTemplate
    });
});
