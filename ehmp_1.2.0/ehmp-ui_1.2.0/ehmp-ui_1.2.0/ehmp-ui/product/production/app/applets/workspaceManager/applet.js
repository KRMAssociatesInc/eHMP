define([
    'underscore',
    'backbone',
    'marionette',
    'app/applets/workspaceManager/appletLayoutView'
], function(_, Backbone, Marionette, AppletLayoutView) {
    'use strict';

    var RootView = Backbone.Marionette.LayoutView.extend({
        showView: function(event, options) {
            var view = ADK.showFullscreenOverlay(AppletLayoutView, {'callShow': true});
            view.initGridster();
        }
    });

    var applet = {
        id: 'workspaceManager',
        getRootView: function() {
            return RootView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('workspaceManagerChannel');
        channel.on('workspaceManager', function() {
            var view = ADK.showFullscreenOverlay(new AppletLayoutView(), {'callShow': true});
        });
    })();

    return applet;
});
