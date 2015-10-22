define([
    "api/ResourceService",
    "api/Messaging"
], function(ResourceService, Messaging) {
    'use strict';

    var TileSortManager = {};

    TileSortManager.getSortOptions = function(originalCollection, appletId, sortAttribute, cb) {
        var wasSorted = false;
        var currentScreen = Messaging.request('get:current:screen');

        if(_.isUndefined(sortAttribute)){
            sortAttribute = 'uid';
        }

        if (currentScreen.config.predefined && typeof cb === 'function'){
            cb(wasSorted, originalCollection);
            return;
        }
        var workspaceId = currentScreen.screenId + '_' + appletId;
        var SortedSaveCollection = Backbone.Collection.extend({
            url: ResourceService.buildUrl('user-defined-sort', {
                'id': workspaceId
            })
        });

        var fetchOptions = {
            reset: true,
            success: function(resp) {
                var obj = _.find(resp.models[0].attributes.applets, function(obj) {
                        return obj.instanceId == appletId;
                    }),
                    wasSorted = false;

                if (obj === undefined) {
                    if (typeof cb === "function") {
                        cb(wasSorted, originalCollection);
                    }
                    return;
                }

                var tileSortOrder = obj.orderSequence[0].split(",");

                for (var i = 0; i < tileSortOrder.length; i++) {

                    wasSorted = true;

                    var currentModel = _.find(originalCollection.models, customSort);
                    originalCollection.remove(currentModel);
                    originalCollection.add(currentModel, {
                        at: i
                    });
                }

                if (typeof cb === "function") {
                    cb(wasSorted, originalCollection);
                }

                function customSort(currentItem) {
                    return currentItem.attributes[sortAttribute] == tileSortOrder[i];
                }
            }
        };
        new SortedSaveCollection().fetch(fetchOptions);

    };

    TileSortManager.reorderRows = function(reorderObj, collection, sortId, sortKey) {
        if(_.isUndefined(sortKey)){
            sortKey = 'uid';
        }

        var temp = collection.at(reorderObj.oldIndex);
        collection.remove(temp);
        collection.add(temp, {
            at: reorderObj.newIndex
        });
        var newSorted = [];

        collection.models.forEach(function(item) {
            if (_.isUndefined(item.attributes) || _.isUndefined(item.attributes[sortKey])){
                return;
            }else {
                newSorted.push(item.attributes[sortKey]);
            }
        });

        var workspaceId = Messaging.request('get:current:screen').screenId + '_' + sortId;
        var SaveSortModel = Backbone.Model.extend({
            sync: function(method, model, options) {

                var params = {
                    type: 'POST',
                    url: model.url(),
                    contentType: "application/json",
                    data: JSON.stringify(model.toJSON()),
                    dataType: "json"
                };

                $.ajax(_.extend(params, options));

            },
            url: function() {
                var id = workspaceId;
                return ResourceService.buildUrl('user-defined-sort', {
                    'id': id
                });
            }
        });

        var obj = {};
        obj.instanceId = sortId;
        obj.keyField = sortKey;
        obj.orderAfter = "";
        obj.fieldValue = newSorted.join(",");

        var saveInstance = new SaveSortModel(obj);
        saveInstance.save(null, {
            success: function() {
                //$(".quickDraw:hover").css("background", "#ffffff");
            },
            error: function(model) {}
        });
    };

    TileSortManager.removeSort = function(instanceId) {

        var workspaceId = Messaging.request('get:current:screen').screenId + '_' + instanceId;
        var fetchOptions = {
            resourceTitle: 'user-defined-sort',
            fetchType: 'DELETE',
            criteria: {
                id: workspaceId,
                instanceId: instanceId
            }
        };

        ResourceService.patientRecordService.fetchCollection(fetchOptions);

    };

    return TileSortManager;
});