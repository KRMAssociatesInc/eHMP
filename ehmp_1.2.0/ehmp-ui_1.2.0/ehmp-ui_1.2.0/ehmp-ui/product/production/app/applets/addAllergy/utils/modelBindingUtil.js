define([
    "backbone",
    "marionette",
    "underscore",
], function(Backbone, Marionette, _) {
    'use strict';

    var modelBindingEvents = {
        'change input': 'fieldChanged',
        'blur input': 'fieldChanged',
        'change textarea': 'fieldChanged',
        'blur textarea': 'fieldChanged',
        'change select': 'selectionChanged',
    };

    return {
        initializeBinding: function() {
            var myEventList = (this.events) ? this.events : this.events = {};
            _.each(modelBindingEvents, function(item, key) {
                var myEvent = myEventList[key],
                    eventPtr;
                if (myEvent === item) {
                    return; //already set, get out and check the next one
                } else if (myEvent) {
                    //collision...we need to merge our events in
                    if (typeof myEvent === 'function') {
                        //it's a function, make a pointer to add to our new function
                        eventPtr = function(e) {
                            myEvent(e);
                            this[key](e);
                        };
                    } else {
                        eventPtr = function(e) {
                            this[myEvent](e);
                            this[key](e);
                        };
                    }
                    this.events[key] = eventPtr;
                } else {
                    //not set, make it so
                    this.events[key] = item;
                }
            }, this);
        },
        selectionChanged: function(e) {
            var field = $(e.currentTarget);
            var value = $("option:selected", field).val();
            var data = {};
            data[field.attr('id')] = value;
            this.model.set(data, {validate: true});
        },
        fieldChanged: function(e) {
            var field = $(e.currentTarget);
            var data = {};
            data[field.attr('id')] = field.val();
            this.model.set(data, {validate: true});
        }
    };
});
