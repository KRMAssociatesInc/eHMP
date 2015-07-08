define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/orders/modalView/headerTemplate',
    ], function(Backbone, Marionette, _, HeaderTemplate) {
    'use strict';

    //Modal Navigation Item View
     return Backbone.Marionette.ItemView.extend({

        template: HeaderTemplate,

        events: {
            'click #orders-previous, #orders-next': 'navigateResults',
            'keydown #orders-previous, #orders-next': 'accessibility'
        },

        modelEvents: {
            "change": "render"
        },

        //treat spacebar press as Enter key - 508 requirement
        accessibility: function(event) {
            if (event.keyCode === 32) {
                this.$('#' + event.currentTarget.id).trigger('click');
            }
        },

        navigateResults: function(event) {
            //the collection.prev and collection.next gets the current model and finds
            //the prev or next for it. If none found, it returns the current model back.
            //we save the initial model (currentModel) in the initialize function
            //so that we can use it as the starting point.
            if (event.currentTarget.id === 'orders-previous') {

                if (this.modelIndex > 0) {
                    this.modelIndex--;
                    if (this.pageable) {
                        this.currentModel = this.collection.fullCollection.at(this.modelIndex);
                    } else {
                        this.currentModel = this.collection.at(this.modelIndex);
                    }
                    this.model.set(this.currentModel.attributes);
                }

            } else { //orders-next clicked

                var modelCount = (this.pageable) ? this.collection.fullCollection.length-1 : this.collection.length-1;
                if (this.modelIndex < modelCount) {
                    this.modelIndex++;
                    if (this.pageable) {
                        this.currentModel = this.collection.fullCollection.at(this.modelIndex);
                    } else {
                        this.currentModel = this.collection.at(this.modelIndex);
                    }
                    this.model.set(this.currentModel.attributes);
                }

            }

            //After rendering we maintain focus on the button that was clicked - 508 requirement
            this.$('#' + event.currentTarget.id).focus();
        }

    });

});
