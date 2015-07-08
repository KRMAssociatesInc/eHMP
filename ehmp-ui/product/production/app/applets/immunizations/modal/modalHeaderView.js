define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/immunizations/modal/headerTemplate'
], function(Backbone, Marionette, _, HeaderTemplate) {
    'use strict';

    var theView;

    //Modal Navigation Item View 
    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #immunizations-previous, #immunizations-next': 'navigateModal'
        },

        navigateModal: function(e) {
            var $target = $(e.currentTarget),
                id = $target.attr('id');
            //The below ternary operator does not get assigned to anything
            //The purpose of this is to execute the functions and do the check on the id
            id === 'immunizations-previous' ? this.theView.getPrevModal() : this.theView.getNextModal();
        },

        template: HeaderTemplate

    });

});
