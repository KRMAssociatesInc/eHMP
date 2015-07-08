define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    var EventHandlers = {
        sortCollection: function(collection, key, sortType, ascending) {
            ADK.utils.sortCollection(collection, key, sortType, ascending);
        }
    };

    return EventHandlers;
});
