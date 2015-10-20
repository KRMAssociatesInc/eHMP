define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'api/Messaging',
    'api/UIComponents',
    'main/AppletsManifest',
    'main/ScreensManifest',
    'main/NewUserScreen',
    'main/PreDefinedScreens',
    '_assets/js/browserDetector/browserDetector'
], function(Backbone, Marionette, $, _, Messaging, UIComponents, AppletsManifest, ScreensManifest, NewUserScreen, PreDefinedScreens, BrowserDetector) {
    'use strict';

    //necessary to stop rjs from following the require call to eHMP-UI
    var SCREENS_MANIFEST = 'app/screens/ScreensManifest.js';
    var PREDEFINED_SCREENS = 'app/screens/PreDefinedScreens.js';
    var NEW_USERS_SCREENS = 'app/screens/NewUserScreen.js';
    var APPLETS_MANIFEST = 'app/applets/appletsManifest.js';

    /** Start loading the ehmp-ui related files */
    var EhmpUiFilesLoaded = $.Deferred();
    var ScreenManifestsLoaded = $.Deferred();
    var PreDefinedScreensLoaded = $.Deferred();
    var NewUserScreenLoaded = $.Deferred();
    var AppletsManifestLoaded = $.Deferred();
    var appManifest = new Backbone.Model();
    var appConfig = new Backbone.Model();
    var Init = {};

    // limit browser to supported browsers
    BrowserDetector.enforceBrowserType();

    // this allows AJAX to send cookies to a server
    // these cookies are needed for the server's session to run
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        options.xhrFields = {
            withCredentials: true
        };
    });

    Array.prototype.equals = function(array) {
        if (!array)
            return false;
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i]))
                    return false;
            } else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    };

    Messaging.reply("NewUserScreen", function() {
        return NewUserScreen;
    });

    Messaging.reply("PreDefinedScreens", function() {
        return PreDefinedScreens;
    });

    Messaging.reply("AppletsManifest", function() {
        return AppletsManifest;
    });

    Messaging.reply("ScreensManifest", function() {
        return ScreensManifest;
    });

    Init.beforeStart = function() {

        //make sure that we have screens and applets to use first
        require([SCREENS_MANIFEST], function(data) {
            _.extend(ScreensManifest, data);
            ScreenManifestsLoaded.resolve();
        });

        require([PREDEFINED_SCREENS], function(data) {
            _.extend(PreDefinedScreens, data);
            PreDefinedScreensLoaded.resolve();
        });

        require([NEW_USERS_SCREENS], function(data) {
            _.extend(NewUserScreen, data);
            NewUserScreenLoaded.resolve();
        });

        require([APPLETS_MANIFEST], function(data) {
            _.extend(AppletsManifest, data);
            AppletsManifestLoaded.resolve();
        });

        $.when(ScreenManifestsLoaded, PreDefinedScreensLoaded, NewUserScreenLoaded, AppletsManifestLoaded).then(function() {
            EhmpUiFilesLoaded.resolve();
            Init.start();
        }, function() {
            EhmpUiFilesLoaded.reject();
        });


    };

    Init.start = function() {
        //make sure that ADK is available to everything
        require([
            'main/ADK'
        ], function(ADK) {
            //now that ADK is ready and global lets allow things to use it
            require([
                'main/ADKApp',
                'main/ResourceDirectory',
                'main/components/views/globalErrorView'
            ], function(ADKApp, ResourceDirectory, GlobalErrorView) {

                var resourceDirectoryLoaded = $.Deferred();

                appManifest.fetch({
                    url: '../manifest.json',
                    global: false
                });
                ADK.Messaging.reply("appManifest", function() {
                    return appManifest;
                });

                ADK.Messaging.reply("appConfig", function() {
                    return appConfig;
                });

                function fetchAppConfig() {
                    var deferred = $.Deferred();
                    appConfig.fetch({
                            url: '../app.json',
                            global: false
                        })
                        .done(function() {
                            deferred.resolve(appConfig);
                        })
                        .fail(function() {
                            console.log('Failed to resolve app.json');
                            deferred.reject();
                        });

                    return deferred.promise();
                }

                function onError() {
                    var ModalRegionView = new GlobalErrorView({
                        errorMessage: "No Response From Resource Server<br/><small>Ensure that you have a stable network connection.</small>",
                        refreshButton: 'Refresh Page'
                    });
                    ADKApp.modalRegion.show(ModalRegionView);
                    $('#mainModal').modal({
                        show: true,
                        backdrop: 'static',
                        keyboard: false
                    });
                }

                $.when(fetchAppConfig()).then(function(appConfig) {
                    console.log("AppConfig: ", appConfig);
                    var resourceDirectory = ResourceDirectory.instance();
                    resourceDirectory.fetch({
                        url: appConfig.get('resourceDirectoryPathFetch'),
                        success: function() {
                            resourceDirectoryLoaded.resolve();
                        },
                        error: function() {
                            onError();
                        }
                    });
                }).fail(onError);

                ADKApp.on('before:start', function() {

                    $.when(resourceDirectoryLoaded, EhmpUiFilesLoaded).done(function() {
                        ADKApp.initAllRouters();
                    });

                    var doit;
                    $(window).on('resize load', function() {
                        clearTimeout(doit);
                        doit = setTimeout(ADK.utils.resize.dw, 300);
                    });
                });

                ADKApp.start({});
            });
        });

    };

    return Init;
});
