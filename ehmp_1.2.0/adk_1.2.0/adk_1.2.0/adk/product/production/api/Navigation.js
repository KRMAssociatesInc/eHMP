'use strict';
define([
    'backbone',
    'jquery',
], function(Backbone, $) {
    var Events = {
        navigate: function(screenName, routeOptions) {
            if(screenName.charAt(0) === '#') {
                screenName = screenName.slice(1);
            }
            var globalChannel = Backbone.Wreqr.radio.channel('global');
            globalChannel.commands.execute('screen:navigate', screenName, routeOptions);
        },
        displayScreen: function(screenName) {
            if(screenName.charAt(0) === '#') {
                screenName = screenName.slice(1);
            }
            var globalChannel = Backbone.Wreqr.radio.channel('global');
            globalChannel.commands.execute('screen:display', screenName);
        }
    };

    return Events;
});
