define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    var EventHandlers = {
        // filterCollectionByDays: function(collection, numberOfDays, dateKey) {
        //     collection.reset(collection.originalModels);
        //     collection.reset(collection.filter(function(model) {
        //         var dateFilter = new Date();
        //         dateFilter.setDate(dateFilter.getDate() - numberOfDays);

        //         if (!(typeof model.get(dateKey) === 'undefined')) {
        //             var lastFilledYear = model.get(dateKey).substring(0, 4),
        //                 lastFilledMonth = model.get(dateKey).substring(4, 6),
        //                 lastFilledDay = model.get(dateKey).substring(6, 8);

        //             var lastFilledDate = new Date(lastFilledYear, lastFilledMonth - 1, lastFilledDay);
        //             if (lastFilledDate != 'Invalid Date') {
        //                 return lastFilledDate > dateFilter;
        //             } else {
        //                 return false;
        //             }
        //         } else {
        //             return false;
        //         }
        //     }));
        // },
        resetCollection: function(collection) {
            collection.reset(collection.originalModels);
        },
        sortCollection: function(collection, key, sortType, ascending) {
            ADK.utils.sortCollection(collection, key, sortType, ascending);
        }
    };

    return EventHandlers;
});
