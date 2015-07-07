define([
'api/Messaging'
], function(Messaging) {
    'use strict';
    var appletBuilder = {
        build: function(marionetteApp, appletPojo) {
            var builtApplet = marionetteApp.module(appletPojo.id, defineAppletModule);

            function defineAppletModule(appletModule, app, backbone, marionette, $, _) {
                if(appletPojo.viewTypes){
                    Messaging.getChannel(appletPojo.id).reply('viewTypes', function(){
                        return appletPojo.viewTypes;
                    });
                    appletModule.viewTypes = appletPojo.viewTypes;
                    if (appletPojo.defaultViewType){
                        appletModule.defaultViewType = appletPojo.defaultViewType;
                    }
                }
                appletModule.id = appletPojo.id;
                appletModule.appletConfig = appletPojo;

                // adding permissions
                if(appletPojo.permissions) {
                    appletModule.permissions = appletPojo.permissions;
                }

                if (appletPojo.onDisplay) {
                    appletModule.displayApplet = appletPojo.onDisplay.bind(appletModule);
                }
                if (appletPojo.getRootView){
                    appletModule.getRootView = appletPojo.getRootView.bind(appletModule);
                }
                appletModule.buildPromise.resolve();
            }
            return builtApplet;

        }
    };

    return appletBuilder;
});
