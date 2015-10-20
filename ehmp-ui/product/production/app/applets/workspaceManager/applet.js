define([
    'underscore',
    'backbone',
    'marionette',
    'app/applets/workspaceManager/appletLayoutView'
], function(_, Backbone, Marionette, AppletLayoutView) {
    'use strict';

    var RootView = Backbone.Marionette.LayoutView.extend({
        showView: function(event, options) {
            var view = new ADK.UI.FullScreenOverlay({
                view: AppletLayoutView,
                options: {
                    'callShow': true
                }
            });
            view.show();
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
            var view = new ADK.UI.FullScreenOverlay({
                view: new AppletLayoutView(),
                options: {
                    'callShow': true
                }
            });
            view.show();
        });
    })();

    return applet;
});