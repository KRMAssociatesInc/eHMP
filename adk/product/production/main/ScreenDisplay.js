define([
    'backbone',
    'marionette',
    'underscore',
    'jquery',
    'main/components/adk_nav/navView',
    'main/Session',
    'main/ComponentLoader',
    'main/components/patient/patientHeaderView',
    'main/components/views/ccowObjectsView',
    'main/ADKApp',
    'main/Utils',
    'api/Messaging',
    'api/ResourceService',
    'api/SessionStorage',
    'api/UserDefinedScreens',
    'main/components/applets/view_switchboard/optionsSelectionView',
    'highcharts',
    'main/components/applet_chrome/chromeView',
    'main/components/views/appletControllerView',
    'handlebars',
    'main/api/WorkspaceFilters',
    'hbs!main/components/applet_chrome/templates/containerTemplate',
    'api/UserService'
], function(Backbone, Marionette, _, $, Nav, session, ComponentLoader, PatientHeaderView, CCOWObjectsView, ADKApp, Utils, Messaging, ResourceService, SessionStorage, UserDefinedScreens, ViewSwitchboard, Highcharts, ChromeView, AppletControllerView, Handlebars, WorkspaceFilters,chromeContainerTemplate, UserService) {
    'use strict';

    var ScreensManifest = Messaging.request('ScreensManifest');
    var ScreenDisplay = {};

    ScreenDisplay.createScreen = function(screenModule, screenName, routeOptions, ADKApp) {
        if (screenModule) {
            if (ADKApp.currentScreen && ADKApp.currentScreen.config && ADKApp.currentScreen.config.onStop) {
                ADKApp.currentScreen.config.onStop();
            }
            ADKApp.currentScreen = screenModule;

            screenModule.buildPromise.done(function() {
                // Only show CCOW ActiveX controls in IE & if we have a session already
                if ("ActiveXObject" in window && (screenName !== ScreensManifest.logonScreen)) {
                    var ccowView = new CCOWObjectsView();
                    ADKApp.ccowRegion.show(ccowView);
                }

                var contentRegion_layoutView, topRegion_layoutView, centerRegion_layoutView;
                screenModule.topRegion_layoutPromise.done(function() {
                    topRegion_layoutView = ADKApp.topRegion.currentView;
                    if (!(topRegion_layoutView instanceof screenModule.topRegion_layoutView)) {
                        topRegion_layoutView = new screenModule.topRegion_layoutView();
                        ADKApp.topRegion.show(topRegion_layoutView);
                    }

                    screenModule.centerRegion_layoutPromise.done(function() {
                        centerRegion_layoutView = ADKApp.centerRegion.currentView;
                        if (!(centerRegion_layoutView instanceof screenModule.centerRegion_layoutView)) {
                            centerRegion_layoutView = new screenModule.centerRegion_layoutView();
                            ADKApp.centerRegion.show(centerRegion_layoutView);
                        }

                        var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                        ComponentLoader.load(ADKApp, topRegion_layoutView, centerRegion_layoutView, screenModule.config, currentPatient);

                        //Adding margin to top of contentRegion to allow topRegion to have fixed position
                        //On resize of the window, re-calulate the height of topRegion
                        $(window).resize(function() {
                            if (this.resizeTO) clearTimeout(this.resizeTO);
                            this.resizeTO = setTimeout(Utils.resize.centerRegion(centerRegion_layoutView, topRegion_layoutView, ADKApp), 100);
                        });
                        Utils.resize.centerRegion(centerRegion_layoutView, topRegion_layoutView, ADKApp);

                        screenModule.contentRegion_layoutPromise.done(function() {
                            if (screenModule.patientRequired) {
                                WorkspaceFilters.retrieveWorkspaceFilters(screenName);
                            }

                            //creating dynamic template for gridster enabled page
                            if (screenModule.config.predefined === false || screenModule.config.contentRegionLayout === 'gridster') {
                                var deferred = UserDefinedScreens.updateScreenModuleFromStorage(screenModule);
                                deferred.done(function() {
                                    var template = UserDefinedScreens.getGridsterTemplate(screenModule);
                                    contentRegion_layoutView = new screenModule.contentRegion_layoutView({
                                        //template: _.template(template),
                                        template: Handlebars.compile(template),
                                        className: function() {
                                            var classString = 'contentPadding';
                                            var predefinedBoolean = screenModule.config.predefined;
                                            if (!_.isUndefined(predefinedBoolean) && !predefinedBoolean) classString += ' user-defined-workspace';
                                            return classString;
                                        },
                                        freezeApplets: screenModule.config.freezeApplets
                                    });
                                    centerRegion_layoutView.content_region.show(contentRegion_layoutView);
                                    screenModule.contentRegion_layoutView_obj = contentRegion_layoutView;
                                });
                            } else {
                                contentRegion_layoutView = new screenModule.contentRegion_layoutView();
                                centerRegion_layoutView.content_region.show(contentRegion_layoutView);
                                screenModule.contentRegion_layoutView_obj = contentRegion_layoutView;
                            }
                            //TEMPORARY FIX FOR LOGIN BACKGROUND IMAGE TO NOT DISPLAY IN APP
                            $('body').removeClass();
                            $('body').addClass('' + screenName);
                            _.each(screenModule.applets, function(currentApplet) {
                                if (typeof currentApplet.setDefaultView === 'function') {
                                    currentApplet.setDefaultView();
                                }
                                var appletModule = ADKApp[currentApplet.id];
                                var userNotAllowed;
                                if (_.isUndefined(appletModule)) {
                                    ScreenDisplay.addEmptyAppletToScreen(currentApplet, screenModule);
                                } else {
                                    $.when(screenModule.contentRegion_layoutPromise,
                                        screenModule.centerRegion_layoutPromise,
                                        screenModule.topRegion_layoutPromise,
                                        appletModule.buildPromise).then(function() {
                                        if (appletModule.permissions) {
                                            _.each(appletModule.permissions, function(permission) {
                                                if (!UserService.hasPermission(permission)) {
                                                    userNotAllowed = true;
                                                    return false;
                                                }
                                            });
                                            if (userNotAllowed) {
                                                ScreenDisplay.addEmptyAppletToScreen(currentApplet, screenModule, userNotAllowed);
                                                return;
                                            }
                                        }
                                        ScreenDisplay.addAppletToScreen(appletModule, currentApplet, screenModule, routeOptions);
                                    });
                                }

                            });
                            if (screenModule.moduleName) {
                                ADK.utils.resize.filteredView(screenModule.moduleName);
                            }
                        });
                    });
                });

                if (screenModule.config.onStart) {
                    screenModule.config.onStart();
                    $('#screen-reader-screen-description').html('You have navigated to ' + screenName + '. Skip to main content.').focus();
                }
            });
        }
    };
    ScreenDisplay.addEmptyAppletToScreen = function(currentApplet, screenModule, userNotAllowed) {
        var appletModel = new Backbone.Model({
            title: currentApplet.id,
            message: 'This applet is not available at this time.',
            messageTextClass: 'text-info'
        });

        if (userNotAllowed) {
            appletModel.set('message', 'This applet is disabled for this user at this time.');
        }

        var MessageView = Backbone.Marionette.ItemView.extend({
            model: appletModel,
            template: Handlebars.compile('<p class="{{messageTextClass}}">{{message}}</p>'),
            className: 'well well-sm'
        });

        var AppletView = Backbone.Marionette.LayoutView.extend({
            template: chromeContainerTemplate,
            model: appletModel,
            className: 'applet-not-found',
            attributes: {
                'data-appletid': currentApplet.id,
                'data-instanceId': currentApplet.instanceId
            },
            regions: {
                message: '.appletDiv_ChromeContainer'
            },
            onBeforeShow: function() {
                this.showChildView('message', new MessageView());
            }
        });

        var contentRegion_layoutView = screenModule.contentRegion_layoutView_obj;
        var regionName = currentApplet.region;
        if (regionName !== 'none') {
            if (_.isUndefined(contentRegion_layoutView[regionName])) {
                contentRegion_layoutView.addRegion(regionName, '#' + regionName);
            }
            contentRegion_layoutView[regionName].show(new AppletView({
                'appletConfig': appletModel
            }));
        }
    };

    ScreenDisplay.addAppletToScreen = function(appletModule, appletConfig, screenModule, routeOptions) {
        if (appletModule) {
            var regionName = appletConfig.region;
            if (_.isUndefined(appletConfig.instanceId) || _.isNull(appletConfig.instanceId)) {
                appletConfig.instanceId = appletConfig.id;
            }

            var viewType = appletModule.defaultViewType || "",
                AppletView,
                options = {
                    appletConfig: appletConfig,
                    routeParam: routeOptions,
                    viewTypes: appletModule.appletConfig.viewTypes,
                    defaultViewType: appletModule.appletConfig.defaultViewType,
                    screenModule: screenModule
                };
            if (appletConfig.viewType !== undefined && appletConfig.viewType !== "undefined") {
                viewType = appletConfig.viewType;
            }
            if (appletModule.viewTypes) {
                if (Utils.appletViewTypes.isChromeEnabled(appletModule.appletConfig, viewType)) {
                    AppletView = ChromeView.extend({
                        appletScreenConfig: appletConfig,
                        appletViewConfig: Utils.appletViewTypes.getViewTypeConfig(appletModule.appletConfig, viewType),
                        AppletView: Utils.appletViewTypes.getViewTypeConfig(appletModule.appletConfig, viewType).view,
                        AppletController: AppletControllerView.extend({
                            viewType: viewType
                        }),
                        attributes: {
                            'data-appletid': appletConfig.id,
                            'data-instanceId': appletConfig.instanceId,
                        }
                    });
                } else {
                    AppletView = AppletControllerView.extend({
                        viewType: viewType
                    }).extend({
                        attributes: {
                            'data-appletid': appletConfig.id,
                            'data-instanceId': appletConfig.instanceId,
                        }
                    });
                }
            } else {
                //Still use old getRootView as backup until it is deprecated
                AppletView = appletModule.getRootView(viewType).extend({
                    attributes: {
                        'data-appletid': appletConfig.id,
                        'data-instanceId': appletConfig.instanceId,
                    }
                });
            }
            var contentRegion_layoutView = screenModule.contentRegion_layoutView_obj;
            if (regionName !== 'none') {
                if (_.isUndefined(contentRegion_layoutView[regionName])) {
                    contentRegion_layoutView.addRegion(regionName, '#' + regionName);
                }
                options.region = contentRegion_layoutView[regionName];
                contentRegion_layoutView[regionName].show(new AppletView(options));
            }

            if (appletModule.displayApplet) {
                appletModule.displayApplet();
            }
        }
    };


    return ScreenDisplay;
});
