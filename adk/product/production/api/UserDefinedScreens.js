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
    var USER_SCREENS_CONFIG = 'UserScreensConfig';

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
                    var titleText = $('.panel-title-label', this).text() || applet.title;
                    applet.title = titleText.trim();
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

                    var viewType = '';
                    // set default view type to first available option if user did not pick any view type
                    if ($(this).attr('data-view-type') === 'default') {
                      viewType = $('#view-option').attr('data-viewtype');
                    } else {
                      viewType = $(this).attr('data-view-type') || $('#view-option').attr('data-viewtype');
                    }
                    applet.viewType = viewType;
                    var titleText = $('.applet-title', this).text() || applet.title;
                    applet.title = titleText.trim();
                    applet.filterName = $(this).attr('data-filter-name');
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
        var template = '<div class="gridster" id="' + screenModule.id + '">';
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
                        (currentApplet.notFound ? 'applet-not-found' : currentApplet.noPermission ? 'permission-denied-applet' : 'fa fa-cog edit-applet') +
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
        var gridsterScreenConfig = UserDefinedScreens.getGridsterConfigFromSession(screenModule.id);
        if (gridsterScreenConfig && !_.isUndefined(gridsterScreenConfig.applets) && !_.isNull(gridsterScreenConfig.applets)) {
            screenModule.applets = gridsterScreenConfig.applets;
        }
        deferred.resolve();
        return deferred;
    };

    UserDefinedScreens.saveConfigToJDS = function(json, key, callback) {
        var id = getId();
        var fetchOptions = {
            resourceTitle: 'write-user-defined-screens',
            fetchType: 'POST',
            criteria: {
                screenType: key,
                param: json,
                pid: id
            }            
        };
        if(callback) fetchOptions.onSuccess = callback;
        ResourceService.fetchCollection(fetchOptions);
    };

    UserDefinedScreens.saveGridsterConfig = function(gridsterAppletJson, key, callback) {
        UserDefinedScreens.saveConfigToJDS(gridsterAppletJson, key, callback);
        UserDefinedScreens.saveGridsterConfigToSession(gridsterAppletJson, key);
        
    };

    UserDefinedScreens.saveGridsterConfigToSession = function(gridsterAppletJson, screenId) {
        var json = Session.get.sessionModel(USER_SCREENS_CONFIG).toJSON();
        var index = -1;
        if (_.isNull(gridsterAppletJson.id) || _.isUndefined(gridsterAppletJson.id)) {
            gridsterAppletJson.id = screenId;
        }
        _.each(json.userDefinedScreens, function(screen, idx) {
            if (screen && screen.id === screenId)
                index = idx;
        });
        if (index === -1) {
            if (json && json.userDefinedScreens)
                json.userDefinedScreens.push(gridsterAppletJson);
        } else {
            json.userDefinedScreens[index] = gridsterAppletJson;
        }

        Session.set.sessionModel(USER_SCREENS_CONFIG, new Backbone.Model(json));
    };

    //this is to return the combined json from session: userScreensConfig, userDefinedScreens, userDefinedFilters, etc.
    UserDefinedScreens.getUserConfigFromSession = function() {
        return Session.get.sessionModel(USER_SCREENS_CONFIG).toJSON();
    }

    UserDefinedScreens.saveUserConfigToSession = function(json) {
        Session.set.sessionModel(USER_SCREENS_CONFIG, new Backbone.Model(json));
    };

    UserDefinedScreens.getScreensConfigFromSession = function() {
        var json = Session.get.sessionModel(USER_SCREENS_CONFIG).toJSON();
        return json.userScreensConfig ? json.userScreensConfig : json;
    };

    UserDefinedScreens.getGridsterConfigFromSession = function(screenId) {
        var json = Session.get.sessionModel(USER_SCREENS_CONFIG).toJSON();
        var screenConfig = _.find(json.userDefinedScreens, function(screen) {
            return screen && screen.id === screenId;
        });
        return screenConfig || Session.get.sessionModel(screenId).toJSON();
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
                screenType: key,
                predefinedScreens: _.pluck(PreDefinedScreens.screens, 'id')
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

    UserDefinedScreens.cloneScreenFilters = function(origId, cloneId) {
        WorkspaceFilters.cloneScreenFilters(origId, cloneId);
    };

    UserDefinedScreens.cloneScreenFiltersToSession = function(origId, cloneId) {
        WorkspaceFilters.cloneScreenFiltersToSession(origId, cloneId);
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

    };

    UserDefinedScreens.cloneUDScreenToSession = function(origId, cloneId) {
        var gridsterConfig = _.clone(UserDefinedScreens.getGridsterConfigFromSession(origId));
        gridsterConfig.id = cloneId;
        UserDefinedScreens.saveGridsterConfigToSession(gridsterConfig, cloneId);
    }

    UserDefinedScreens.saveScreensConfig = function(screenConfigJson, callback) {
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
            UserDefinedScreens.saveConfigToJDS(screenConfigJson, USER_SCREENS_CONFIG, callback);
        }
    };

    UserDefinedScreens.saveScreensConfigToSession = function(screenConfigJson) {
        var json = Session.get.sessionModel(USER_SCREENS_CONFIG).toJSON();
        if (json.userScreensConfig) {
            json.userScreensConfig.screens = screenConfigJson.screens;
            if (!json.userDefinedScreens) json.userDefinedScreens = [];
        } else {
            json = {
                userScreensConfig: {
                    screens: screenConfigJson.screens
                },
                userDefinedScreens: []
            };
        }
        Session.set.sessionModel(USER_SCREENS_CONFIG, new Backbone.Model(json));
    };

    UserDefinedScreens.cloneGridsterConfig = function(origScreenId, newScreenId) {
        var configClone = Session.get.sessionModel(origScreenId).toJSON();
        if (!_.isUndefined(configClone) && !_.isEmpty(configClone)) {
            configClone.id = newScreenId;
            UserDefinedScreens.saveGridsterConfig(configClone, newScreenId);
        }
    };

    UserDefinedScreens.addNewScreen = function(newScreenConfig, screenIndex, callback) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();
        var screens = screensConfig.screens;
        if (screenIndex) {
            screens.splice(screenIndex, 0, newScreenConfig);
        } else {
            screens.push(newScreenConfig);
        }
        UserDefinedScreens.saveScreensConfig(screensConfig, callback);
    };

    UserDefinedScreens.screensConfigNullCheck = function() {
        var promise = UserDefinedScreens.getScreensConfig(USER_SCREENS_CONFIG);
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
        var promise = UserDefinedScreens.getConfig(USER_SCREENS_CONFIG);
        var deferred = new $.Deferred();
        var filterScreensOnHasPermission = function(screens) {
            var provisionedScreens = [];
            var hasPermission = function(screen) {
                    if (!_.isUndefined(screen) && !_.isUndefined(screen.hasPermission)) {
                        if (_.isFunction(screen.hasPermission)) {
                            var permission = screen.hasPermission();
                            if (!_.isBoolean(permission)) {
                                return false;
                            }
                            return permission;
                        } else {
                            return false;
                        }
                    }
                    return true;
                };

            _.each(screens, function(screen) {
                if (_.isUndefined(screen.hasPermission) || hasPermission(screen)) {
                    provisionedScreens.push(screen);
                }
            });
            return provisionedScreens;
        };

        promise.done(function(screenConfig) {
            var provissionedScreens = filterScreensOnHasPermission(PreDefinedScreens.screens);
            var pdScreens = _.clone(provissionedScreens);
            var screensConfigOrig = screenConfig.toJSON();
            if(!screensConfigOrig.userScreensConfig) screensConfigOrig.userScreensConfig = {screens: []};
            screenConfig = screensConfigOrig.userScreensConfig ? screensConfigOrig.userScreensConfig : screensConfigOrig;
            var uSDefaultScreen = ADK.ADKApp.userSelectedDefaultScreen;
            if (_.isEmpty(screenConfig)) {
                screenConfig = {
                    screens: []
                };
            }

            var userDefined = false;
            /* remove predefined screens with hasPermission property. Will be added back later. */
            screenConfig.screens = _.filter(screenConfig.screens, function(screen) {
                return (!_.has(screen, 'hasPermission') && !_.has(screen, 'addNavigationTab'));
            });
            _.each(screenConfig.screens, function(screen) {
                if (!screen) {
                    return;
                }
                userDefined = !screen.predefined;
                if (userDefined) {
                    if (screen.defaultScreen) {
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
                            if (_.has(screen, 'addNavigationTab') && !_.has(s, 'addNavigationTab')) {
                                s.addNavigationTab = screen.addNavigationTab;
                            }
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
                    if (screen.defaultScreen === true) {
                        uSDefaultScreen = screen.id;
                    }
                }
            });

            ADK.ADKApp.userSelectedDefaultScreen = uSDefaultScreen;
            if (UserService.getUserSession().get('status') === 'loggedin') {
                Session.set.sessionModel(USER_SCREENS_CONFIG, new Backbone.Model(screensConfigOrig));
            }
            deferred.resolve(screenConfig);
        });
        return deferred;
    };

    UserDefinedScreens.sortScreensByIds = function(ids) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();
        var screens = screensConfig.screens;
        if (screens.length != ids.length) return;
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

    UserDefinedScreens.setHasCustomize = function(screenId) {
        var screensConfig = UserDefinedScreens.getScreensConfigFromSession();
        var screens = screensConfig.screens;
        var newConfig = {
            screens: []
        };

        var s = _.find(screens, function(screen) {
            return screen.id === screenId && screen.hasCustomize;
        });
        if (!s) return;

        _.each(screens, function(screen) {
            if (screen.id === screenId) {
                screen.hasCustomize = false;
            }
            newConfig.screens.push(screen);
        });
        UserDefinedScreens.saveScreensConfig(newConfig);
    };

    var findIndex = function(array, callback, thisArg) {
        var index = -1,
            length = array ? array.length : 0;

        while (++index < length) {
            if (callback(array[index], index, array)) {
                return index;
            }
        }
        return -1;
    };

    var findScreenIndexFromUserDefinedGraphs = function(json, screenId) {
        var screenIndex = findIndex(json.userDefinedGraphs, function(screen) {
            return screen.id === screenId;
        });
        return screenIndex;
    };

    var findAppletIndexFromUserDefinedGraphs = function(screenConfig, instanceId) {
        if(!screenConfig) return -1;
        var appletIndex = findIndex(screenConfig.applets, function(applet) {
            return applet.instanceId === instanceId;
        });
        return appletIndex;
    };

    //get stacked graph for one applet from session
    UserDefinedScreens.getStackedGraphForOneAppletFromSession = function(screenId, appletInstanceId) {
        var json = UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndexFromUserDefinedGraphs(json, screenId);
        if (screenIndex === -1) return;
        var screenConfig = json.userDefinedGraphs[screenIndex];
        var appletIndex = findAppletIndexFromUserDefinedGraphs(screenConfig, appletInstanceId);
        if (appletIndex === -1) return;
        var graphs = _.clone(screenConfig.applets[appletIndex].graphs);

        return graphs;
    };

    //remove one stacked graph for one applet from session
    UserDefinedScreens.removeOneStackedGraphFromSession = function(screenId, appletInstanceId, graphType, typeName) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndexFromUserDefinedGraphs(json, screenId);
        if (screenIndex === -1) return;
        var screenConfig = json.userDefinedGraphs[screenIndex];
        var appletIndex = findAppletIndexFromUserDefinedGraphs(screenConfig, appletInstanceId);
        if (appletIndex === -1) return;
        var appletConfig = screenConfig.applets[appletIndex];

        var graphIndex = -1;
        appletConfig.graphs.forEach(function(graph, index) {
            if (graph.graphType === graphType && graph.typeName === typeName) {
                graphIndex = index;
            }
        });
        if (graphIndex > -1) {
            json.userDefinedGraphs[screenIndex].applets[appletIndex].graphs.splice(graphIndex, 1);
        }

        //delete entire applet definition if no graph remain
        if (json.userDefinedGraphs[screenIndex].applets[appletIndex].graphs.length === 0) {
            json.userDefinedGraphs[screenIndex].applets.splice(appletIndex, 1);
        }
        UserDefinedScreens.saveUserConfigToSession(json);

    };

    //remove all stacked graphs for one applet from session
    UserDefinedScreens.removeAllStackedGraphFromSession = function(screenId, appletInstanceId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndexFromUserDefinedGraphs(json, screenId);
        if (screenIndex === -1) return;
        var screenConfig = json.userDefinedGraphs[screenIndex];
        var appletIndex = findAppletIndexFromUserDefinedGraphs(screenConfig, appletInstanceId);
        if (appletIndex === -1) return;
        json.userDefinedGraphs[screenIndex].applets.splice(appletIndex, 1);
        UserDefinedScreens.saveUserConfigToSession(json);

    };

    //add one stacked graph to session
    UserDefinedScreens.addOneStackedGraphToSession = function(screenId, appletInstanceId, graphType, typeName) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        if(!json.userDefinedGraphs) json.userDefinedGraphs = [];
        var screenIndex = findScreenIndexFromUserDefinedGraphs(json, screenId);
        if (screenIndex === -1) {
            if (!json.userDefinedGraphs) json.userDefinedGraphs = [];
            json.userDefinedGraphs.push({
                applets: [],
                id: screenId
            });
            screenIndex = 0;
        }
        var screenConfig = json.userDefinedGraphs[screenIndex];
        var appletIndex = findAppletIndexFromUserDefinedGraphs(screenConfig, appletInstanceId);
        if (appletIndex === -1) {
            json.userDefinedGraphs[screenIndex].applets.push({
                graphs: [{
                    graphType: graphType,
                    typeName: typeName
                }],
                instanceId: appletInstanceId
            });
            UserDefinedScreens.saveUserConfigToSession(json);
            return;
        }
        var appletConfig = screenConfig.applets[appletIndex];
        if (!appletConfig.graphs) appletConfig.graphs = [];
        var graphIndex = -1;
        appletConfig.graphs.forEach(function(graph, index) {
            if (graph.graphType === graphType && graph.typeName === typeName) {
                graphIndex = index;
            }
        });
        if (graphIndex > -1) {
            json.userDefinedGraphs[screenIndex].applets[appletIndex].graphs.splice(graphIndex, 1);
        }

        json.userDefinedGraphs[screenIndex].applets[appletIndex].graphs.push({
            graphType: graphType,
            typeName: typeName
        });

        UserDefinedScreens.saveUserConfigToSession(json);

    };

    //clone filters from one screen to another in Session
    UserDefinedScreens.cloneScreenGraphsToSession = function(fromScreenId, toScreenId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndexFromUserDefinedGraphs(json, fromScreenId);
        if (screenIndex === -1) return;
        var screenConfig = _.clone(json.userDefinedGraphs[screenIndex]);
        screenConfig.id = toScreenId;
        var toScreenIndex = findScreenIndexFromUserDefinedGraphs(json, toScreenId);
        if (toScreenIndex > -1) json.userDefinedGraphs[toScreenIndex] = screenConfig;
        else json.userDefinedGraphs.push(screenConfig);
        ADK.UserDefinedScreens.saveUserConfigToSession(json);
    };


    //update screenId
    UserDefinedScreens.updateScreenId = function(oldId, newId) {
        UserDefinedScreens.updateScreenIdInSession(oldId, newId);

        //Update screenId in JDS
        UserDefinedScreens.updateScreenIdInJDS(oldId, newId);
    };

    UserDefinedScreens.updateScreenIdInSession = function(oldId, newId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        //update id for screen config
        var screenIndex = findIndex(json.userDefinedScreens, function(screen) {
            return screen.id === oldId;
        });
        if(screenIndex > -1) {
            json.userDefinedScreens[screenIndex].id = newId;
        }
        //update id for filters
        var screenIndex2 = findIndex(json.userDefinedFilters, function(screen) {
            return screen.id === oldId;
        });
        if(screenIndex2 > -1) {
            json.userDefinedFilters[screenIndex2].id = newId;
        }
        //update id for stacked graph
        var screenIndex3 = findIndex(json.userDefinedGraphs, function(screen) {
            return screen.id === oldId;
        });
        if(screenIndex3 > -1) {
            json.userDefinedGraphs[screenIndex3].id = newId;
        }
        ADK.UserDefinedScreens.saveUserConfigToSession(json);
    };

    UserDefinedScreens.updateScreenIdInJDS = function(oldId, newId, callback) {
        var id = getId();
        var fetchOptions = {
            resourceTitle: 'write-user-defined-screens',
            fetchType: 'PUT',
            criteria: {
                oldId: oldId,
                newId: newId,
                pid: id
            }
        };
        if(callback) fetchOptions.onSuccess = callback;
        ResourceService.fetchCollection(fetchOptions);
    };

    //remove the screen filters and stacked graph from session
    UserDefinedScreens.removeOneScreenFromSession = function(screenId) {
        WorkspaceFilters.removeAllFiltersForOneScreenFromSession(screenId);
        UserDefinedScreens.removeAllStackedGraphForOneScreenFromSession(screenId);
    };

    //remove all stacked graphs for screen from session
    UserDefinedScreens.removeAllStackedGraphForOneScreenFromSession = function(screenId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndexFromUserDefinedGraphs(json, screenId);
        if (screenIndex === -1) return;
        json.userDefinedGraphs.splice(screenIndex, 1);
        UserDefinedScreens.saveUserConfigToSession(json);
    };

    return UserDefinedScreens;
});
