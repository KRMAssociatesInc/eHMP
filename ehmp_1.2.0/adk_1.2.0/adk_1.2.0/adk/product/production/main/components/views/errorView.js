define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/errorTemplate",
    "api/ErrorMessaging"
], function(Backbone, Marionette, _, ErrorTemplate, ErrorMessaging) {
    'use strict';
    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: ErrorTemplate,
        initialize: function(options){
            console.log("----------- ERROR -----------");
            console.log("Error Object: ");
            console.log(JSON.stringify(this.model.attributes));
            console.log("Response Text: " + this.model.get('responseText'));
            console.log("Response Status Text: " + this.model.get('statusText'));
            console.log("Response Status: " + this.model.get('status'));
            console.log("----------- END ERROR -----------");

            this.model.set('message', ErrorMessaging.getMessage(this.model.get('status')));
        }
    });

    var Error = {
        create: function(options) {
            var errorView = new ErrorView(options);
            return errorView;
        }

    };
    return Error;
});
