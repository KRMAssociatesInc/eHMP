define([
    'backbone',
    'marionette',
    'underscore',
    'main/AppletBuilder',
    'main/Session',
    'api/SessionStorage',
    'api/UserDefinedScreens',
    'api/Messaging',
    'api/Navigation'
], function(Backbone, Marionette, _, AppletBuilder, Session, SessionStorage, UserDefinedScreens, Messaging, Navigation) {
    'use strict';

    var ScreensManifest = Messaging.request('ScreensManifest');
    var AppletsManifest = Messaging.request('AppletsManifest');
    var NewUserScreen = Messaging.request('NewUserScreen');
    var ScreenBuilder = {};

    ScreenBuilder.addNewScreen = function(screenConfig, app, screenIndex) {
        screenConfig.fileName = "NewUserScreen";

        //initialize the screen
        var screenModule = app.module(screenConfig.routeName);
        screenModule.buildPromise = $.Deferred();
        var routeController = initializeRouteController(app, screenConfig.routeName);
        initializeRouter(screenConfig.routeName, routeController);

        //build the screen
        require(['app/screens/' + screenConfig.fileName], function(screenDescriptor) {
            screenDescriptor.id = screenConfig.id;
            onLoadScreen(screenDescriptor);
        });

        UserDefinedScreens.addNewScreen(screenConfig, screenIndex);

        function onLoadScreen(screenConfig) {
            ScreenBuilder.build(app, screenConfig);
        }
    };


    ScreenBuilder.editScreen = function(newScreenConfig, origId) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();

        var screenIndex;
        _.find(screensConfig.screens, function(screen, Idx) {
            if (screen.id === origId) {
                screenIndex = Idx;
                return true;
            }
        });

        if (newScreenConfig.id !== origId) {
            //update gridster config key to match the new id
            var gridsterConfig = UserDefinedScreens.getGridsterConfigFromSession(origId);
            gridsterConfig.id = newScreenConfig.id;
            UserDefinedScreens.saveGridsterConfig(gridsterConfig, newScreenConfig.id);
            UserDefinedScreens.saveGridsterConfig({}, origId);

            //Replace original screen module with a new one one that has the correct route and name
            ADK.ADKApp[newScreenConfig.id] = ADK.ADKApp[origId];
            ADK.ADKApp[newScreenConfig.id].id = newScreenConfig.id;
            ADK.ADKApp[newScreenConfig.id].moduleName = newScreenConfig.id;
            ADK.ADKApp[origId] = undefined;
        }

        if (Backbone.history.fragment === origId) {
            //I'm not convinced this is the best approach
            window.history.pushState({}, 'eHMP', '#' + newScreenConfig.id);
            Backbone.history.fragment = newScreenConfig.id;
        }

        screensConfig.screens[screenIndex] = newScreenConfig;
        UserDefinedScreens.saveScreensConfig(screensConfig);
    };

    //Deletes the user screen and checks if removed screen is a default screen
    ScreenBuilder.deleteUserScreen = function(screenId) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();

        var screenToRemove = _.find(screensConfig.screens, function(screen) {
            return screen.id === screenId;
        });
        screensConfig.screens = _.without(screensConfig.screens, screenToRemove);
        UserDefinedScreens.saveScreensConfig(screensConfig);
        UserDefinedScreens.saveGridsterConfig({}, screenToRemove.id);
        if (screenToRemove.defaultScreen === true) {
            ScreenBuilder.resetUserSelectedDefaultScreen();
            console.log("deleting user default screen, setting defaultscreen from predefined default");
        }

        // if we are trying to delete the screen that we came from, let's go back to the predefined default screen.
        if (Backbone.history.fragment === screenToRemove.id) {
            Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen, {
                trigger: false
            });
        }
        ADK.ADKApp[screenToRemove.id] = undefined;
    };

    //Processes a new title and returns a different name if title already exists
    ScreenBuilder.titleExists = function(title) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();
        var titleExists = false;
        _.find(screensConfig.screens, function(screen, Idx) {
            if (screen.title.toLowerCase() === title.toLowerCase()) {
                titleExists = true;
            }
        });
        return titleExists;
    };


    //Sets the Overview to Default, sets all other screens as not default
    ScreenBuilder.resetUserSelectedDefaultScreen = function() {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();

        var setToDefault = _.map(screensConfig.screens, function(screen) {
            if (screen.id === ADK.ADKApp.predefinedDefaultScreen) {
                screen.defaultScreen = true;
                ADK.ADKApp.userSelectedDefaultScreen = screen.id;

            } else {
                screen.defaultScreen = false;
            }
            return screen;
        });
        var newScreenConfig = {};
        newScreenConfig.screens = setToDefault;
        UserDefinedScreens.saveScreensConfig(newScreenConfig);
    };

    //Setting all screens to not be default
    ScreenBuilder.resetDefaultScreen = function() {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();

        var setNoDefault = _.map(screensConfig.screens, function(screen) {
            screen.defaultScreen = false;
            return screen;
        });

        var newScreenConfig = {};
        newScreenConfig.screens = setNoDefault;
        UserDefinedScreens.saveScreensConfig(newScreenConfig);
    };

    ScreenBuilder.setNewDefaultScreen = function(newDefaultScreenId) {
        ScreenBuilder.resetDefaultScreen();
        ADK.ADKApp.userSelectedDefaultScreen = newDefaultScreenId;
    };

    ScreenBuilder.initAllRouters = function(app) {
        var deferred = new $.Deferred();
        var promise = UserDefinedScreens.getScreensConfig();
        promise.done(function(screensConfig) {
            // concat user Session screens into screen manifest
            var additionalScreens = screensConfig.screens;

            _.each(additionalScreens, function(screen) {
                if (_.isUndefined(screen.routeName)) {
                    screen.routeName = screen.id;
                }
                var containScreen = _.filter(ScreensManifest.screens, function(s) {
                    return s.routeName === screen.routeName;
                });
                if (containScreen.length === 0) ScreensManifest.screens.push(screen);

            });

            _.each(ScreensManifest.screens, function initRouter(screenDescriptor) {
                var screenModule = app.module(screenDescriptor.routeName);
                screenModule.buildPromise = $.Deferred();
                var routeController = initializeRouteController(app, screenDescriptor.routeName);
                initializeRouter(screenDescriptor.routeName, routeController);
            });
            deferred.resolve();
        });
        return deferred;
    };

    ScreenBuilder.buildAll = function(marionetteApp) {
        _.each(AppletsManifest.applets, function(applet) {
            // If applet module is undefined, then no screen has built it yet
            if (marionetteApp[applet.id] === undefined) {
                // marionetteApp[applet.id] will be defined from now on - another screen won't build it again
                var appletModule = marionetteApp.module(applet.id);

                appletModule.buildPromise = $.Deferred();
                require(['app/applets/' + applet.id + '/applet'], function(appletPojo) {
                    if (applet.permissions) {
                        appletPojo.permissions = applet.permissions;
                    }
                    AppletBuilder.build(marionetteApp, appletPojo);
                });
            }
        });

        _.each(ScreensManifest.screens, function loadScreen(screenDescriptor) {
            if (_.isUndefined(screenDescriptor.fileName) || screenDescriptor.fileName === 'NewUserScreen') {
                var sc = _.clone(NewUserScreen);
                sc.id = screenDescriptor.id;
                onLoadScreen(sc);
            } else {
                require(['app/screens/' + screenDescriptor.fileName], onLoadScreen);
            }
        });

        function onLoadScreen(screenConfig) {
            ScreenBuilder.build(marionetteApp, screenConfig);
        }
    };

    ScreenBuilder.build = function(marionetteApp, screenConfig) {
        var builtScreen = marionetteApp.module(screenConfig.id);
        initializeScreenModule(marionetteApp, builtScreen, screenConfig);
        builtScreen.buildPromise.resolve();
        if (builtScreen.config && builtScreen.config.predefined === false)
            UserDefinedScreens.updateScreenModuleFromStorage(builtScreen);
        return builtScreen;
    };

    function initializeScreenModule(marionetteApp, screenModule, screenConfig) {
        screenModule.id = screenConfig.id;
        screenModule.title = screenConfig.title;
        screenModule.applets = screenConfig.applets;
        if (screenConfig.patientRequired) {
            screenModule.patientRequired = screenConfig.patientRequired;
        } else screenModule.patientRequired = false;
        screenModule.config = screenConfig;
        if (ScreensManifest.testEnvironmentFlag && (ScreensManifest.testEnvironmentFlag === true)) {
            SessionStorage.addModel('patient', Session.patient);
        }

        //Layout to use in the top-region of index
        screenModule.topRegion_layoutPromise = $.Deferred();
        //If screen specifies true to the requiresPatient variable then use layout that shows patient related components.
        if (screenConfig.patientRequired === true) {
            screenConfig.topRegionLayout = "default_patientRequired";
        } else {
            screenConfig.topRegionLayout = "default_noPatientRequired";
        }
        require(['main/layouts/topRegionLayouts/' + screenConfig.topRegionLayout], function(loadedLayout) {
            screenModule.topRegion_layoutView = loadedLayout;
            screenModule.topRegion_layoutPromise.resolve();
        });

        //Layout to use in the center-region of index
        screenModule.centerRegion_layoutPromise = $.Deferred();
        //Add logic if screen needs to define the appCenterLayout
        screenConfig.centerRegionLayout = "default_fullWidth";
        require(['main/layouts/centerRegionLayouts/' + screenConfig.centerRegionLayout], function(loadedLayout) {
            screenModule.centerRegion_layoutView = loadedLayout;
            screenModule.centerRegion_layoutPromise.resolve();
        });

        //Layout to use in the applet-region
        screenModule.contentRegion_layoutPromise = $.Deferred();
        require(['main/layouts/' + screenConfig.contentRegionLayout], function(loadedLayout) {
            screenModule.contentRegion_layoutView = loadedLayout;
            screenModule.contentRegion_layoutPromise.resolve();
        });
    }

    function initializeRouter(routeName, routeController) {
        var routes = {};
        routes[routeName] = 'displayScreen';

        var routerOptions = {
            appRoutes: routes,
            controller: routeController
        };
        new Marionette.AppRouter(routerOptions);
    }

    function initializeRouteController(marionetteApp, screenName) {
        return {
            displayScreen: function(routeOptions) {
                marionetteApp.execute('screen:display', screenName, routeOptions);
            }
        };
    }

    return ScreenBuilder;
});
