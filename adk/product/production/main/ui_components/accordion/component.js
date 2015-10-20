define([
    'handlebars'
], function(Handlebars) {
    'use strict';

    return Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile("<h1>Accordion</h1>")
    });
});