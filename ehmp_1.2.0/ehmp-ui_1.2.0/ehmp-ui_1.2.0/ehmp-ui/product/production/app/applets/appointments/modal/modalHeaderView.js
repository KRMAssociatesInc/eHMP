define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/appointments/modal/headerTemplate'
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

            //what does the code below exist for the ternary is never assigned to anything?
            id === 'ccd-previous' ? this.theView.getPrevModal() : this.theView.getNextModal();
        },

        template: HeaderTemplate

    });

});
