define([
    "api/ResourceService",
    "api/Messaging"
], function(ResourceService, Messaging) {
    'use strict';

    var TileSortManager = {};

    TileSortManager.getSortOptions = function(originalCollection, appletId, cb) {

        if (Messaging.request('get:current:screen').config.id.indexOf('workspace') < 0)
            return;
        var workspaceId = Messaging.request('get:current:screen').config.id + '_' + appletId;
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
                        cb(wasSorted);
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
                    cb(wasSorted);
                }

                function customSort(currentItem) {
                    if (obj.keyField === 'typeName')
                        return currentItem.attributes.typeName == tileSortOrder[i];
                    else
                        return currentItem.attributes.uid == tileSortOrder[i];
                }
            }
        };
        new SortedSaveCollection().fetch(fetchOptions);

    };

    TileSortManager.reorderRows = function(reorderObj, originalCollection, appletId, sortKey) {

        var temp = originalCollection.at(reorderObj.oldIndex);
        originalCollection.remove(temp);
        originalCollection.add(temp, {
            at: reorderObj.newIndex
        });
        var newSorted = [];

        originalCollection.models.forEach(function(item) {
            if (item.attributes === undefined)
                return;
            if (item.attributes.typeName !== undefined && sortKey === 'typeName') {
                newSorted.push(item.attributes.typeName);
            } else {
                if (item.attributes.uid !== undefined) {
                    newSorted.push(item.attributes.uid);
                }
            }
        });

        var workspaceId = Messaging.request('get:current:screen').config.id + '_' + appletId;
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
        obj.instanceId = appletId;
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

        var workspaceId = Messaging.request('get:current:screen').config.id + '_' + instanceId;
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