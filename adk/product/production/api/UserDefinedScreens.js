define([
    'underscore',
    'backbone',
    'marionette',
    'jquery',
    'api/ResourceService',
    'api/Navigation',
    'api/SessionStorage',
    'api/UserService',
    'api/Messaging',
    'main/api/WorkspaceFilters'
], function(_, Backbone, Marionette, $, ResourceService, Navigation, Session, UserService, Messaging, WorkspaceFilters) {
    'use strict';

    var UserDefinedScreens = {};
    var id;
    var ScreensManifest = Messaging.request('ScreensManifest');
    var AppletsManifest = Messaging.request('AppletsManifest');
    var PreDefinedScreens = Messaging.request('PreDefinedScreens');

    UserDefinedScreens.getAppletDefaultConfig = function(id) {
        var appletConfig = _.find(AppletsManifest.applets, function(applet) {
            return applet.id === id;
        });
        if (_.isUndefined(appletConfig)) {
            appletConfig = {
                id: id,
                title: 'Title undefined'
            };
        }
        return _.clone(appletConfig);
    };

    UserDefinedScreens.serializeGridsterScreen = function($gridster, screenName) {
        var divs = $gridster.find('[data-row]');
        var screen = {
            id: screenName,
            contentRegionLayout: 'gridster',
            appletHeader: 'navigation',
            appLeft: 'patientInfo',
            userDefinedScreen: true,
        };
        var applets = [];
        divs.each(function() {
            var $appletEl = $(this).find('[data-appletid]');
            var applet = {};
            var id;
            if ($appletEl.length > 0) {
                id = $appletEl.attr('data-appletid');
                if (!_.isUndefined(id)) {
                    applet = UserDefinedScreens.getAppletDefaultConfig(id);
                    applet.instanceId = $appletEl.attr('data-instanceid');
                    applet.region = $(this).attr('id');
                    applet.dataRow = $(this).attr('data-row');
                    applet.dataCol = $(this).attr('data-col');
                    applet.dataSizeX = $(this).attr('data-sizex');
                    applet.dataSizeY = $(this).attr('data-sizey');

                    applet.dataMinSizeX = $(this).attr('data-min-sizex');
                    applet.dataMinSizeY = $(this).attr('data-min-sizey');
                    applet.dataMaxSizeX = $(this).attr('data-max-sizex');
                    applet.dataMaxSizeY = $(this).attr('data-max-sizey');
                    applet.viewType = $(this).attr('data-view-type');
                    applet.title = $('.panel-title-label', this).text() || applet.title;
                    applet.filterName = $(this).attr('data-filter-name');
                    applets.push(applet);
                }

            } else {
                id = $(this).attr('data-appletid');
                if (!_.isUndefined(id)) {
                    applet = UserDefinedScreens.getAppletDefaultConfig(id);
                    applet.instanceId = $(this).attr('data-instanceid');
                    applet.region = $(this).attr('id');
                    applet.dataRow = $(this).attr('data-row');
                    applet.dataCol = $(this).attr('data-col');
                    applet.dataSizeX = $(this).attr('data-sizex');
                    applet.dataSizeY = $(this).attr('data-sizey');

                    applet.dataMinSizeX = $(this).attr('data-min-sizex');
                    applet.dataMinSizeY = $(this).attr('data-min-sizey');
                    applet.dataMaxSizeX = $(this).attr('data-max-sizex');
                    applet.dataMaxSizeY = $(this).attr('data-max-sizey');
                    applet.viewType = $(this).attr('data-view-type');
                    applets.push(applet);
                }

            }


        });
        screen.applets = applets;
        return screen;
    };

    UserDefinedScreens.setAppletDataAttribute = function(currentApplet) {
        var appletManifestObject = _.find(AppletsManifest.applets, function(item) {
            return item.id === currentApplet.id;
        });
        var isAppletInManifest = !_.isEmpty(appletManifestObject);
        if (isAppletInManifest) {
            var permissions = appletManifestObject.permissions || [];
            _.each(permissions, function(permission) {
                if (!UserService.hasPermission(permission)) {
                    currentApplet.noPermission = true;
                    return false;
                }
            });
        } else {
            currentApplet.notFound = true;
        }

        if (_.isUndefined(currentApplet.dataSizeX)) currentApplet.dataSizeX = 4;
        if (_.isUndefined(currentApplet.dataSizeY)) currentApplet.dataSizeY = 4;
        if (currentApplet.viewType === 'expanded') {
            if (_.isUndefined(currentApplet.dataSizeX))
                currentApplet.dataSizeX = 8;
            currentApplet.dataMinSizeX = 8;
            currentApplet.dataMaxSizeX = 12;
            currentApplet.dataMinSizeY = 4;
            currentApplet.dataMaxSizeY = 12;
        } else if (currentApplet.viewType === 'gist') {
            currentApplet.dataMinSizeX = 4;
            currentApplet.dataMaxSizeX = 8;
            currentApplet.dataMinSizeY = 4;
            currentApplet.dataMaxSizeY = 12;

        } else {
            //summary view or default
            currentApplet.dataMinSizeX = 4;
            currentApplet.dataMaxSizeX = 8;
            currentApplet.dataMinSizeY = 4;
            currentApplet.dataMaxSizeY = 12;
        }
    };

    UserDefinedScreens.getGridsterTemplate = function(screenModule) {
        var template = '<div class="gridster">';
        _.each(screenModule.applets, function(currentApplet) {
            if (currentApplet.region.toLowerCase() != 'none') {
                UserDefinedScreens.setAppletDataAttribute(currentApplet);
                template += '<div id="' + currentApplet.region +
                    '" data-row="' + currentApplet.dataRow +
                    '" data-col="' + currentApplet.dataCol +
                    '" data-sizex="' + currentApplet.dataSizeX +
                    '" data-sizey="' + currentApplet.dataSizeY +
                    '" data-min-sizex="' + currentApplet.dataMinSizeX +
                    '" data-max-sizex="' + currentApplet.dataMaxSizeX +
                    '" data-min-sizey="' + currentApplet.dataMinSizeY +
                    '" data-max-sizey="' + currentApplet.dataMaxSizeY +
                    '" data-filter-name="' + getFilterNameOrDefault(currentApplet) +
                    '" data-view-type="' + currentApplet.viewType +
                    '" ></div>';
            }
        });
        template += '</div>{{{paginationHtml}}}';
        return template;
    };

    UserDefinedScreens.getGridsterMaxColumn = function(screenModule) {
        var maxCol = 0;
        _.each(screenModule.applets, function(currentApplet) {
            if (currentApplet.region.toLowerCase() != 'none') {
                UserDefinedScreens.setAppletDataAttribute(currentApplet);
                var sizeX = parseInt(currentApplet.dataSizeX);
                var col = parseInt(currentApplet.dataCol);
                if (sizeX + col > maxCol) maxCol = sizeX + col;
            }
        });
        return maxCol;
    };

    function getFilterNameOrDefault(applet) {
        return applet.filterName || 'Filtered';
    }

    function getViewTypeDisplay(type) {
        if (type === "gist") {
            return "trend";
        } else {
            return type;
        }
    }
    UserDefinedScreens.getGridsterTemplateForEditor = function(screenModule) {
        var deferred = new $.Deferred();
        UserDefinedScreens.updateScreenModuleFromStorage(screenModule).done(function() {
            var template = '<div id="gridster2" class="gridster"><ul>';
            _.each(screenModule.applets, function(currentApplet) {
                if (currentApplet.region.toLowerCase() != 'none') {
                    UserDefinedScreens.setAppletDataAttribute(currentApplet);
                    template += '<li id="' + currentApplet.region +
                        '" data-appletid="' + currentApplet.id +
                        '" data-instanceid="' + currentApplet.instanceId +
                        '" data-row="' + currentApplet.dataRow +
                        '" data-col="' + currentApplet.dataCol +
                        '" data-sizex="' + currentApplet.dataSizeX +
                        '" data-sizey="' + currentApplet.dataSizeY +
                        '" data-min-sizex="' + currentApplet.dataMinSizeX +
                        '" data-max-sizex="' + currentApplet.dataMaxSizeX +
                        '" data-min-sizey="' + currentApplet.dataMinSizeY +
                        '" data-max-sizey="' + currentApplet.dataMaxSizeY +
                        '" data-filter-name="' + getFilterNameOrDefault(currentApplet) +
                        '" data-view-type="' + currentApplet.viewType +
                        '" ><div class="' +
                        (currentApplet.notFound ? 'applet-not-found' : currentApplet.noPermission ? 'permission-denied-applet': 'fa fa-cog edit-applet') +
                        '"></div><br><div class="formatButtonText"><p class="applet-title">' + currentApplet.title + '<p>' +
                        (currentApplet.notFound ? '<span class="text-warning">Applet Not Found</span>' : currentApplet.noPermission ? '<span class="text-danger">Permission Denied</span>' : getViewTypeDisplay(currentApplet.viewType)) +
                        '</div>';
                }

            });
            template += '</ul></div>';
            deferred.resolve(template);
        });
        return deferred;


    };

    UserDefinedScreens.getGridsterTemplateForPreview = function(screenModule) {
        var template = '<div id="gridsterPreview" class="gridster"><ul>';
        _.each(screenModule.applets, function(currentApplet) {
            if (currentApplet.region.toLowerCase() != 'none') {
                UserDefinedScreens.setAppletDataAttribute(currentApplet);
                template += '<li tabindex="0" ' +
                    ' data-row="' + currentApplet.dataRow +
                    '" data-col="' + currentApplet.dataCol +
                    '" data-sizex="' + currentApplet.dataSizeX +
                    '" data-sizey="' + currentApplet.dataSizeY +
                    '" ><br><div class="formatButtonText"><p class="applet-title">' + currentApplet.title + '</p><p class="applet-type">' + getViewTypeDisplay(currentApplet.viewType) + '</p></div>';
            }

        });
        template += '</ul></div>';
        return template;
    };

    UserDefinedScreens.updateScreenModuleFromStorage = function(screenModule) {
        var deferred = new $.Deferred();
        if (screenModule.config && screenModule.config.predefined) {
            deferred.resolve();
            return deferred;
        }
        var gridsterScreenConfig_promise = UserDefinedScreens.getGridsterConfig(screenModule.id);

        gridsterScreenConfig_promise.done(function(gridsterScreenConfig) {
            // console.log('updateScreenModuleFromStorage gridster config', JSON.stringify(gridsterScreenConfig.toJSON()));
            if (gridsterScreenConfig && !_.isUndefined(gridsterScreenConfig.get('applets')) && !_.isNull(gridsterScreenConfig.get('applets'))) {
                screenModule.applets = gridsterScreenConfig.get('applets');
            }
            deferred.resolve();
        });
        return deferred;
    };

    UserDefinedScreens.saveConfigToJDS = function(json, key) {
        var id = getId();
        var model = new Backbone.Model({
            screenType: key,
            param: json
        });
        model.urlRoot = ResourceService.buildUrl('write-user-defined-screens', {
            pid: id
        });
        model.save();
    };

    UserDefinedScreens.saveGridsterConfig = function(gridsterAppletJson, key) {
        UserDefinedScreens.saveGridsterConfigToSession(gridsterAppletJson, key);
        UserDefinedScreens.saveConfigToJDS(gridsterAppletJson, key);
    };

    UserDefinedScreens.saveGridsterConfigToSession = function(gridsterAppletJson, key) {
        // console.log('save to session' + key, gridsterAppletJson);
        Session.set.sessionModel(key, new Backbone.Model(gridsterAppletJson));
    };

    UserDefinedScreens.getScreensConfigFromSession = function() {
        return Session.get.sessionModel('UserScreensConfig').toJSON();
    };

    UserDefinedScreens.getGridsterConfigFromSession = function(screenId) {
        return Session.get.sessionModel(screenId).toJSON();
    };

    UserDefinedScreens.getConfig = function(key) {
        var deferred = new $.Deferred();
        var id = getId();
        var userSession = UserService.getUserSession();
        if (_.isUndefined(key) || _.isUndefined(userSession) || userSession.get('status') === 'loggedout') {
            deferred.resolve(new Backbone.Model({}));
            return deferred;
        }

        var res = Session.get.sessionModel(key).toJSON();
        if (!_.isUndefined(res) && !_.isEmpty(res)) {
            deferred.resolve(new Backbone.Model(res));
            return deferred;
        }

        // return Session.get.sessionModel(key).toJSON(); //Old Version
        var fetchOptions = {
            resourceTitle: 'user-defined-screens',
            criteria: {
                pid: id,
                screenType: key
            }
        };
        var coll;

        fetchOptions.onSuccess = function() {
            if (coll.length > 0) {
                deferred.resolve(coll.at(0));
                if (userSession.get('status') === 'loggedin') {
                    Session.set.sessionModel(key, coll.at(0));
                }
            } else {
                deferred.resolve(new Backbone.Model({}));
            }
        };
        fetchOptions.onError = function() {
            deferred.resolve(new Backbone.Model({}));
        };
        coll = ResourceService.fetchCollection(fetchOptions);
        return deferred;
    };

    UserDefinedScreens.getGridsterConfig = function(key) {
        return UserDefinedScreens.getConfig(key);
    };

    UserDefinedScreens.cloneScreenFilters = function(origId, cloneId) {
        WorkspaceFilters.cloneScreenFilters(origId, cloneId);
    };

    UserDefinedScreens.cloneScreen = function(origId, cloneId, predefined) {
        var url = ResourceService.buildUrl('write-user-defined-screens-copy', {
            fromId: origId,
            toId: cloneId,
            predefined: predefined
        });
        $.post(url).done(function() {
            console.log('Success in saving clone of workspace ' + origId);
        }).fail(function() {
            console.log('Error in saving clone of workspace ' + origId);
        });

        var configClone = Session.get.sessionModel(origId).toJSON();
        if (!_.isUndefined(configClone) && !_.isEmpty(configClone)) {
            configClone.id = cloneId;

            UserDefinedScreens.saveGridsterConfigToSession(configClone, cloneId);
        }
    };

    UserDefinedScreens.saveScreensConfig = function(screenConfigJson) {
        var nullScreenExists = _.some(screenConfigJson.screens, function(screen) {
            return !screen;
        });
        if (nullScreenExists) {
            console.error('Error: Cannot save a null or undefined screen. Removing that screen');
            var definedScreensOnly = _.filter(screenConfigJson.screens, function(screen) {
                if (!_.isUndefined(screen) && screen !== null) {
                    return screen;
                }
            });
            screenConfigJson.screens = definedScreensOnly;
        }
        var pid = getId();
        if (pid) {
            UserDefinedScreens.saveScreensConfigToSession(screenConfigJson);
            UserDefinedScreens.saveConfigToJDS(screenConfigJson, 'UserScreensConfig');
        }
    };

    UserDefinedScreens.saveScreensConfigToSession = function(screenConfigJson) {
        Session.set.sessionModel('UserScreensConfig', new Backbone.Model(screenConfigJson));
    };

    UserDefinedScreens.cloneGridsterConfig = function(origScreenId, newScreenId) {
        var configClone = Session.get.sessionModel(origScreenId).toJSON();
        if (!_.isUndefined(configClone) && !_.isEmpty(configClone)) {
            configClone.id = newScreenId;
            UserDefinedScreens.saveGridsterConfig(configClone, newScreenId);
        }
    };

    UserDefinedScreens.addNewScreen = function(newScreenConfig, screenIndex) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();
        var screens = screensConfig.screens;
        if (screenIndex) {
            screens.splice(screenIndex, 0, newScreenConfig);
        } else {
            screens.push(newScreenConfig);
        }
        UserDefinedScreens.saveScreensConfig(screensConfig);
    };

    UserDefinedScreens.screensConfigNullCheck = function() {
        var promise = UserDefinedScreens.getScreensConfig('UserScreensConfig');
        promise.done(function(screenConfig) {
            var definedScreensOnly = _.filter(screenConfig.screens, function(screen) {
                if (!_.isUndefined(screen) && screen !== null) {
                    return screen;
                } else {
                    console.log("Deleted null screen");
                }
            });
            screenConfig.screens = definedScreensOnly;
            UserDefinedScreens.saveScreensConfig(screenConfig);
        });
    };

    UserDefinedScreens.getScreensConfig = function() {
        var promise = UserDefinedScreens.getConfig('UserScreensConfig');
        var deferred = new $.Deferred();
        promise.done(function(screenConfig) {
            var pdScreens = _.clone(PreDefinedScreens.screens);
            screenConfig = screenConfig.toJSON();
            var uSDefaultScreen = ADK.ADKApp.userSelectedDefaultScreen;
            if (_.isEmpty(screenConfig)) {
                screenConfig = {
                    screens: []
                };
            }

            var userDefined = false;
            _.each(screenConfig.screens, function(screen) {
                if (!screen) {
                    return;
                }
                userDefined = !screen.predefined;
                if (userDefined) {
                    var gridsterConfigPromise = UserDefinedScreens.getConfig(screen.routeName);
                    if(screen.defaultScreen) {
                        uSDefaultScreen = screen.id;
                    }

                }
            });

            _.each(pdScreens, function(screen) {
                var containScreen = _.filter(screenConfig.screens, function(s) {
                    if (!s || !screen) {
                        return;
                    }
                    if (s.title === screen.title) {
                        if (s.id === screen.id) {
                            //both the id and title must match
                            return s.id === screen.id;
                        } else {
                            //if a predefined screen is somehow duplicated, but the id's dont match, remove the duplicate screen
                            console.warn('Removing duplicate predefined screen: ' + s.title);
                            screenConfig.screens = _.without(screenConfig.screens, s);
                            UserDefinedScreens.saveGridsterConfig({}, s.id);
                            if (s.defaultScreen === true) {
                                var resetDefault = _.map(screenConfig.screens, function(screen) {
                                    screen.defaultScreen = false;
                                    if (screen.id === "overview") {
                                        screen.defaultScreen = true;
                                    }
                                    return screen;
                                });
                                screenConfig.screens = resetDefault;
                                console.log("Deleting default screen, setting Overview as default screen");
                            }
                            UserDefinedScreens.saveScreensConfig(screenConfig);


                            // if we are trying to delete the screen that we came from, go back to the predefined default screen.
                            if (Backbone.history.fragment === s.id) {
                                Navigation.navigate(ADK.ADKApp.predefinedDefaultScreen, {
                                    trigger: false
                                });
                            }
                        }
                    }
                });
                if (containScreen.length < 1 && screen) {
                    screenConfig.screens.push(screen);
                    if(screen.defaultScreen === true) {
                        uSDefaultScreen = screen.id;
                    }
                }
            });

            ADK.ADKApp.userSelectedDefaultScreen = uSDefaultScreen;
            if (UserService.getUserSession().get('status') === 'loggedin') {
                Session.set.sessionModel('UserScreensConfig', new Backbone.Model(screenConfig));
            }
            deferred.resolve(screenConfig);
        });
        return deferred;
    };

    UserDefinedScreens.sortScreensByIds = function(ids) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();
        var screens = screensConfig.screens;
        var newConfig = {
            screens: []
        };

        _.each(ids, function(id) {
            var screen = _.find(screens, function(screen) {
                return screen.id === id;
            });
            newConfig.screens.push(screen);
        });
        UserDefinedScreens.saveScreensConfig(newConfig);

    };

    UserDefinedScreens.getScreenBySnomedCt = function(snomedCt) {
        var promise = UserDefinedScreens.getScreensConfig();
        var deferred = new $.Deferred();
        var filteredScreenList = [];
        promise.done(function(screensConfig) {
            // look for a screen with the given snomed code in it's list of associated problems
            var screens = screensConfig.screens;
            for (var i = 0, screenLen = screens.length; i < screenLen; i++) {
                var associatedProblems = screens[i].problems;
                if (associatedProblems) {
                    for (var k = 0, probLen = associatedProblems.length; k < probLen; k++) {
                        if (associatedProblems[k].snomed === snomedCt) {
                            filteredScreenList.push(screens[i]);
                        }
                    }
                }
            }
            deferred.resolve(filteredScreenList);

        });
        return deferred.promise();
    };

    function getId() {

        var patient = ResourceService.patientRecordService.getCurrentPatient();
        var id;

        // Get the pid param in the same way as ResourceService.patientRecordService.fetchCollection does
        if (patient.get("icn")) {
            id = patient.get("icn");
        } else if (patient.get("pid")) {
            id = patient.get("pid");
        } else {
            id = patient.get("id");
        }

        return id;

    }

    UserDefinedScreens.saveScrollPositionToSession = function(value) {
        var scrollPositionJSON = {
            scrollPosition: value
        };
        Session.set.sessionModel('WorkspaceScrollPosition', new Backbone.Model(scrollPositionJSON));
    };

    UserDefinedScreens.getScrollPositionFromSession = function() {
        var scrollPosition = Session.get.sessionModel('WorkspaceScrollPosition').toJSON().scrollPosition;
        return scrollPosition !== undefined ? scrollPosition : 0;
    };

    return UserDefinedScreens;
});
