define([
    'backbone',
    'marionette',
    'underscore',
    'jquery',
    'main/Session',
    'main/ScreenDisplay',
    'main/ScreenBuilder',
    'api/Messaging',
    "api/SessionStorage",
    "api/UserDefinedScreens",
    "api/ResourceService",
    "api/UserService",
    "api/Navigation"
], function(Backbone, Marionette, _, $, Session, ScreenDisplay, ScreenBuilder, Messaging, SessionStorage, UserDefinedScreens, ResourceService, UserService, Navigation) {
    'use strict';

    var ScreensManifest = Messaging.request('ScreensManifest');
    var ADKApp = new Backbone.Marionette.Application();
        ADKApp.initAllRoutersPromise = new $.Deferred();
        ADKApp.session = Session;
        ADKApp.predefinedDefaultScreen = ScreensManifest.predefinedDefaultScreen;
        ADKApp.userSelectedDefaultScreen = ADKApp.predefinedDefaultScreen;

    ADKApp.on('start', function() {
        // save the original defaultscreen in case it gets changed

        ADKApp.initAllRoutersPromise.done(function() {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });
    });

    ADKApp.commands.setHandler('screen:navigate', function(screenName, routeOptions) {
        ADKApp.router.navigate(screenName);
        ADKApp.execute('screen:display', screenName, routeOptions);
    });

    ADKApp.commands.setHandler('screen:display', function(screenName, routeOptions) {
        console.log('Command display:screen received, screenName:', screenName);
        if (!screenName) {
            // if not logged in don't call navigate, we don't want to see the cover-sheet route.
            if (UserService.checkUserSession()) {
                screenName = ADKApp.userSelectedDefaultScreen;
                Navigation.navigate(screenName);
            }
        }
         //TODO Find a more elegant approach that utilizes the code already
        if ($('#mainModal').hasClass('in') || $('#mainOverlay').hasClass('in') || $('.modal-backdrop').hasClass('in')) {
            $('#mainModal, #mainOverlay').modal('hide');
            $('#mainModal').trigger('close.bs.modal');
        }
        var screenModule;
        if (!UserService.checkUserSession()) {
            if (screenName !== ScreensManifest.ssoLogonScreen) {
                screenName = ScreensManifest.logonScreen;
                screenModule = ADKApp[screenName];
                ScreenDisplay.createScreen(screenModule, screenName, routeOptions, ADKApp);
            }
            if (!screenName) {
                console.log('logonScreen is undefined.  Update ScreensManifest with logonScreen.');
            }
        } else {
            if (_.isUndefined(ADKApp[screenName])) {
                console.warn('Screen module is undefined for screen ' + screenName + '. Redirecting to default screen');
                Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen, {
                    trigger: false
                });
            } else {
                ADKApp.initAllRoutersPromise.done(function() {
                    ADKApp[screenName].buildPromise.done(function() {
                        if ($.isEmptyObject(ResourceService.patientRecordService.getCurrentPatient().attributes) && (ADKApp[screenName].config.patientRequired === true)) {
                            screenName = ScreensManifest.patientSearchScreen;
                            ADKApp.router.navigate(screenName);
                            screenModule = ADKApp[screenName];
                            console.log('No Patient Selected: rerouting to patient-search-screen');
                        }
                        screenModule = ADKApp[screenName];
                        ScreenDisplay.createScreen(screenModule, screenName, routeOptions, ADKApp);
                    });
                });
            }
        }
    });

    Messaging.on('patient:selected', function(patient) {
        SessionStorage.clear('appletStorage');
        SessionStorage.delete.sessionModel('globalDate', true);
        SessionStorage.delete.sessionModel('patient');
        SessionStorage.addModel('patient', patient);
    });

    Messaging.reply('get:current:screen', function(){ return ADKApp.currentScreen;});

    /**
     * This is the part that WILL take the user to the login screen
     * @return {undefined}
     */
    Messaging.on('user:sessionEnd', function() {
        var screenName = ADKApp.userSelectedDefaultScreen;
        Navigation.navigate(screenName);
    });

    ADKApp.addRegions({
        ccowRegion: '#ccow-controls',
        topRegion: '#top-region',
        centerRegion: '#center-region',
        bottomRegion: '#bottom-region',
        modalRegion: '#modal-region'
    });

    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            '*default': 'defaultRoute'
        },
        onRoute: function(name, path, args) {
            console.log('onRoute name:', name);
            console.log('onRoute path:', path);
            console.log('onRoute args:', args);
        }
    });

    var AppController = Backbone.Marionette.Controller.extend({
        defaultRoute: function(routeName) {
            if (routeName && routeName.indexOf("?") > -1 && routeName.indexOf("=") > -1 && routeName.split("?")[0] === ScreensManifest.ssoLogonScreen) {
                var routeInfo = routeName.split("?");
                SessionStorage.clear('SSO');
                SessionStorage.addModel('SSO', new Backbone.Model({
                    'CPRSHostIP': routeInfo[1].split("=")[1]
                }));
                ADKApp.execute('screen:navigate', routeInfo[0]);
            } else {
                ADKApp.execute('screen:display');
            }
        }
    });

    ADKApp.router = new Router({
        controller: new AppController()
    });

    ADKApp.initAllRouters = function(){
        var promise = ScreenBuilder.initAllRouters(ADKApp);
        promise.done(function() {
            ScreenBuilder.buildAll(ADKApp);
            ADKApp.initAllRoutersPromise.resolve();
        });
    };

    ADKApp.ScreenPassthrough = {
        setNewDefaultScreen: function(id) {
            return ScreenBuilder.setNewDefaultScreen(id);
        },
        deleteUserScreen: function(id) {
            return ScreenBuilder.deleteUserScreen(id);
        },
        editScreen: function(options, id) {
            return ScreenBuilder.editScreen(options, id);
        },
        titleExists: function(title) {
            return ScreenBuilder.titleExists(title);
        },
        addNewScreen: function(options, app, index){
            return ScreenBuilder.addNewScreen(options, app, index);
        }
    };

    return ADKApp;
});
