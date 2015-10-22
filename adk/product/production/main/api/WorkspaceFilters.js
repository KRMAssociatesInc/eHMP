// The purpose of this module is to handle all create/read/update/delete operations for
//      the userdefinedscreens/userdefinedfilterResource resource. It would essentially be a
//      service in a traditional n-tier app.
define([
    'backbone',
    'marionette',
    'underscore',
    'jquery',
    'api/Messaging',
    'api/ResourceService'
], function(Backbone, Marionette, _, $, Messaging, ResourceService) {
    'use strict';

    var WorkspaceFilters = {};
    var filtersCollection = null;

    var getAppletFromUdafJson = function(config, appletInstanceId) {
        if (_.isNull(config) || _.isUndefined(config)) return null;
        var myApplet = _.find(config.applets, function(applet) {
            return applet.instanceId === appletInstanceId;
        });
        return myApplet;
    };

    var callOnDone = function(collection, appletInstanceId, onDone, context) {
        var applet = getAppletFromUdafJson(collection, appletInstanceId);
        var args = {
            applet: applet,
            anyFilters: applet ? applet.filters.length > 0 : false
        };
        onDone.call(context || this, args);
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

    var findScreenIndex = function(json, workspaceId) {
        var screenIndex = findIndex(json.userDefinedFilters, function(screen) {
            return screen.id === workspaceId;
        });
        return screenIndex;
    };

    var findAppletIndex = function(screenConfig, instanceId) {
        var appletIndex = findIndex(screenConfig.applets, function(applet) {
            return applet.instanceId === instanceId;
        });
        return appletIndex;
    };

    // Deletes a filter from an applet in JDS
    WorkspaceFilters.deleteFilterFromJDS = function(workspaceId, instanceId, filter) {
        var fetchOptions = {
            resourceTitle: 'user-defined-filter',
            fetchType: 'DELETE',
            criteria: {
                id: workspaceId,
                instanceId: instanceId,
                filter: filter
            }
        };
        var collection = ResourceService.patientRecordService.fetchCollection(fetchOptions);
        WorkspaceFilters.deleteFilterFromSession(workspaceId, instanceId, filter);
    };

    WorkspaceFilters.deleteFilterFromSession = function(workspaceId, instanceId, filter) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndex(json, workspaceId);
        var screenConfig = json.userDefinedFilters[screenIndex];
        var appletIndex = findAppletIndex(screenConfig, instanceId);
        var appletConfig = screenConfig.applets[appletIndex];
        var filterIndex = appletConfig.filters.indexOf(filter);
        if (filterIndex > -1) {
            json.userDefinedFilters[screenIndex].applets[appletIndex].filters.splice(filterIndex, 1);
        }

        //delete entire applet definition if no filters remain
        if (json.userDefinedFilters[screenIndex].applets[appletIndex].filters.length === 0) {
            json.userDefinedFilters[screenIndex].applets.splice(appletIndex, 1);
        }
        ADK.UserDefinedScreens.saveUserConfigToSession(json);

    };

    // Adds a filter to an applet in JDS
    WorkspaceFilters.saveFilterToJDS = function(workspaceId, instanceId, filter) {
        var saveFilterModel = new Backbone.Model();
        saveFilterModel.urlRoot = ResourceService.buildUrl('user-defined-filter', {
            id: workspaceId, //workspace name
            instanceId: instanceId, //Applet instance ID for which the filter applies
            filter: filter
        });
        saveFilterModel.save(null);
        WorkspaceFilters.saveFilterToSession(workspaceId, instanceId, filter);
    };

    WorkspaceFilters.saveFilterToSession = function(workspaceId, instanceId, filter) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        if (!json.userDefinedFilters) json.userDefinedFilters = [];
        var screenIndex = findScreenIndex(json, workspaceId);
        if (screenIndex === -1) {
            json.userDefinedFilters.push({
                id: workspaceId,
                applets: [{
                    filters: [filter],
                    instanceId: instanceId
                }]
            });
        } else {
            var appletIndex = findAppletIndex(json.userDefinedFilters[screenIndex], instanceId);
            if (appletIndex === -1) {
                json.userDefinedFilters[screenIndex].applets.push({
                    filters: [filter],
                    instanceId: instanceId
                });
            } else {
                json.userDefinedFilters[screenIndex].applets[appletIndex].filters.push(filter);
            }
        }
        ADK.UserDefinedScreens.saveUserConfigToSession(json);
    };

    // Initiates the ajax request that will make workspace filter data available to applets (filter.js, chromeView.js
    //      and filterButtonView.js). It is called once while building a workspace in ScreenDisplay.js
    WorkspaceFilters.retrieveWorkspaceFilters = function(screenName) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var config = _.find(json.userDefinedFilters, function(screen) {
            return screen.id === screenName;
        });
        Messaging.trigger('workspaceFilters:retrieve', config);
        filtersCollection = config;
        return config;
    };

    // Retrieves filter data for an applet instance and returns it via the onDone callback.  Because the ajax call
    //      initiated in retrieveWorkspaceFilters may return before or after a caller calls onRetrieveWorkspaceFilters,
    //      there is some work performed to ensure that onDone will always be called regardless of when the ajax call returns.
    WorkspaceFilters.onRetrieveWorkspaceFilters = function(appletInstanceId, onDone, context) {
        var theFiltersAjaxCallAlreadyReturned = filtersCollection !== null;
        if (theFiltersAjaxCallAlreadyReturned) {
            callOnDone(filtersCollection, appletInstanceId, onDone, context);
        } else {
            Messaging.once('workspaceFilters:retrieve', function(collection) {
                callOnDone(collection, appletInstanceId, onDone, context);
            }, context);
        }
    };

    // Subscribes the caller to changes in the filter collection via the onDone callback.  Is guarangeed to call
    //      onDone at least once, either immediately if the ajax call has already returned, or as soon as the ajax
    //      call returns.
    WorkspaceFilters.onAppletFilterCollectionChanged = function(appletInstanceId, onDone, context) {
        this.onRetrieveWorkspaceFilters(appletInstanceId, onDone, context);
        Messaging.on('filters:collectionChanged:' + appletInstanceId, function(args) {
            onDone.call(context || this, args);
        }, this);
    };

    // Sends a request to JDS to remove all filters from an applet
    WorkspaceFilters.removeAllFiltersFromApplet = function(workspaceId, appletId) {
        var fetchOptions = {
            resourceTitle: 'user-defined-filter-all',
            fetchType: 'DELETE',
            criteria: {
                id: workspaceId,
                instanceId: appletId
            }
        };
        ResourceService.fetchCollection(fetchOptions);

        WorkspaceFilters.removeAllFiltersFromAppletFromSession(workspaceId, appletId);
    };

    WorkspaceFilters.removeAllFiltersFromAppletFromSession = function(workspaceId, appletId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndex(json, workspaceId);
        if (screenIndex === -1) return;
        var screenConfig = json.userDefinedFilters[screenIndex];
        var appletIndex = findAppletIndex(screenConfig, appletId);
        if (appletIndex === -1) return;

        //delete entire applet definition 
        json.userDefinedFilters[screenIndex].applets.splice(appletIndex, 1);

        ADK.UserDefinedScreens.saveUserConfigToSession(json);
    };

    // Several places within the app (e.g. the applet title bar) are interested in the existance of filters, this alerts them
    WorkspaceFilters.triggerGlobalFiltersChangedAlert = function(appletInstanceId, anyFilters) {
        Messaging.trigger('filters:collectionChanged:' + appletInstanceId, {
            anyFilters: anyFilters
        });
    };

    WorkspaceFilters.cloneScreenFilters = function(origId, cloneId) {
        var fetchOptions = {
            resourceTitle: 'user-defined-filter',
            fetchType: 'PUT',
            criteria: {
                fromId: origId,
                toId: cloneId
            }
        };
        ResourceService.fetchCollection(fetchOptions);
    };

    //clone filters from one screen to another in Session
    WorkspaceFilters.cloneScreenFiltersToSession = function(fromScreenId, toScreenId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndex(json, fromScreenId);
        if (screenIndex === -1) return;
        var screenConfig = _.clone(json.userDefinedFilters[screenIndex]);
        screenConfig.id = toScreenId;
        var toScreenIndex = findScreenIndex(json, toScreenId);
        if (toScreenIndex > -1) json.userDefinedFilters[toScreenIndex] = screenConfig;
        else json.userDefinedFilters.push(screenConfig);
        ADK.UserDefinedScreens.saveUserConfigToSession(json);
    };

    WorkspaceFilters.removeAllFiltersForOneScreenFromSession = function(workspaceId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndex(json, workspaceId);
        if (screenIndex === -1) return;
        json.userDefinedFilters.splice(screenIndex, 1);
        ADK.UserDefinedScreens.saveUserConfigToSession(json);
    };

    return WorkspaceFilters;
});