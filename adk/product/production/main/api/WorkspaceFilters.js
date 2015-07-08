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

    var getAppletFromUdafJson = function(collection, appletInstanceId) {
        if (collection.models.length === 0) return null;
        var filerCollection = collection.models[0].get("userdefinedfilters");
        if (filerCollection === undefined) return null;
        var myApplet = _.find(filerCollection.applets, function(applet) { return applet.instanceId === appletInstanceId; });
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
    };

    // Adds a filter to an applet in JDS
    WorkspaceFilters.saveFilterToJDS = function(workspaceId, instanceId, filter) {
        var saveFilterModel = new Backbone.Model();
        saveFilterModel.urlRoot = ResourceService.buildUrl('user-defined-filter', {
            id: workspaceId,         //workspace name
            instanceId: instanceId, //Applet instance ID for which the filter applies
            filter: filter
        });
        saveFilterModel.save(null);

    };

    // Initiates the ajax request that will make workspace filter data available to applets (filter.js, chromeView.js
    //      and filterButtonView.js). It is called once while building a workspace in ScreenDisplay.js
    WorkspaceFilters.retrieveWorkspaceFilters = function(screenName) {
        filtersCollection = null;
        var predefined = ADK.ADKApp.currentScreen.config.predefined;
        var filterFetchOptions = {
            resourceTitle: 'user-defined-filter',
            fetchType: 'GET',
            criteria: {
                id: screenName,
                predefined: predefined
            }
        };
        filterFetchOptions.onSuccess = function(collection) {
            Messaging.trigger('workspaceFilters:retrieve', collection);
            filtersCollection = collection;
        };
        ResourceService.patientRecordService.fetchCollection(filterFetchOptions);
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
    };

    // Several places within the app (e.g. the applet title bar) are interested in the existance of filters, this alerts them
    WorkspaceFilters.triggerGlobalFiltersChangedAlert = function(appletInstanceId, anyFilters) {
        Messaging.trigger('filters:collectionChanged:' + appletInstanceId, { anyFilters: anyFilters });
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

    return WorkspaceFilters;
});
