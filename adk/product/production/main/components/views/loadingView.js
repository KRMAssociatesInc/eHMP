define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/loadingTemplate"
], function(Backbone, Marionette, _, LoadingTemplate) {
    'use strict';
    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: LoadingTemplate
    });

    var Loading = {
        create: function(options) {
            return new LoadingView();
        }

    };
    return Loading;
});
