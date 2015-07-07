define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    var EventHandlers = {

        sortByActivityDate: function (first, second) {
            if (first === second)
                return 0;
            if (first.get('activityDateTime') < second.get('activityDateTime') || (second === undefined))
                return 1;
            else
                return -1;
        },
        isDateBefore: function (date, model) {
            //convert the date to an acceptable format
            if (date === undefined) return true;
            if(model === undefined || model.activityDateTime === undefined) return false;//if there is no activityDateTime, filter out
            return date <= model.activityDateTime.substr(0, 8);
        },
        isDateAfter: function (date, model) {
            if (date === undefined) return true;
            if(model === undefined || model.activityDateTime === undefined) return false; //if there is no activityDateTime, filter out
            return date >= model.activityDateTime.substr(0, 8);
        },
        isValidDate: function(model) {
            if(model === undefined || model.activityDateTime === undefined) return false;//if there is no activityDateTime, filter out
            return model.activityDateTime.length >= 6;
        }
    };

    return EventHandlers;
});
