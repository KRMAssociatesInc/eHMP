define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/problems/modalView/headerTemplate'
], function(Backbone, Marionette, _, HeaderTemplate) {
    'use strict';

    //Modal Navigation Item View
    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #ccd-previous, #ccd-next': 'navigateModal'
        },

        navigateModal: function(e) {
            var $target = $(e.currentTarget),
                id = $target.attr('id');
            //The ternary operator below is never assigned
            id === 'ccd-previous' ? this.theView.getPrevModal() : this.theView.getNextModal();
        },

        template: HeaderTemplate

    });

});
