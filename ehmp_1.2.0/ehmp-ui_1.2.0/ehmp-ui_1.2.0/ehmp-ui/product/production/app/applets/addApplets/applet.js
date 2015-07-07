define([
    'underscore',
    'backbone',
    'marionette',
    'app/applets/addApplets/appletLayoutView'
], function(_, Backbone, Marionette, AppletLayoutView) {

    'use strict';

    var RootView = Backbone.Marionette.LayoutView.extend({
        showView: function(event, options) {
            // var view = ADK.showFullscreenOverlay(AppletLayoutView, {'callShow': true});
            // view.initGridster();
        }
    });

    var applet = {
        id: 'addApplets',
        getRootView: function() {
            return RootView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('addAppletsChannel');
        channel.on('addApplets', function() {
            var view = ADK.showFullscreenOverlay(new AppletLayoutView(), {'callShow': true});
            view.initGridster();
        });
    })();

    return applet;
});
