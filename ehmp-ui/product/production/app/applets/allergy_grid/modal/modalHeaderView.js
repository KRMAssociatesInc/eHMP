define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/allergy_grid/modal/headerTemplate'
], function(Backbone, Marionette, _, HeaderTemplate) {
    'use strict';

    var theView;

    //Modal Navigation Item View
    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #allergy-grid-previous, #allergy-grid-next': 'navigateModal'
        },

        navigateModal: function(e) {
            var $target = $(e.currentTarget),
                id = $target.attr('id');

            //the below ternary operator is never assigned
            id === 'allergy-grid-previous' ? this.theView.getPrevModal() : this.theView.getNextModal();
        },

        template: HeaderTemplate

    });

});