define([
    'underscore',
    'backbone',
    'marionette',
    'app/applets/addApplets/appletLayoutView'
], function(_, Backbone, Marionette, AppletLayoutView) {

    'use strict';

    var RootView = Backbone.Marionette.LayoutView.extend({
        showView: function(event, options) {
            // var view = ADK.UI.FullScreenOverlay.show(AppletLayoutView, {'callShow': true});
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
            var view = new ADK.UI.FullScreenOverlay({
                view: new AppletLayoutView(),
                options: {
                    'callShow': true
                }
            });
            view.show();
            view.initGridster();
        });
    })();

    return applet;
});