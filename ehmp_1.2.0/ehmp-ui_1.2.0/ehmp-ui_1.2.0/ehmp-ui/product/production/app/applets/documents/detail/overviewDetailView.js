define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/documents/detail/simple/docDetailTemplate'
], function(Backbone, Marionette, _, detailTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: detailTemplate,
    });
});
