define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/ccd_grid/modal/headerTemplate'
], function(Backbone, Marionette, _, HeaderTemplate) {
    'use strict';

    var theView;

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
