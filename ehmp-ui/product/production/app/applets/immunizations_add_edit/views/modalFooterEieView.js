define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/immunizations_add_edit/templates/footerEieTemplate'
], function(Backbone, Marionette, _, FooterTemplate) {
    'use strict';

    var immunizationChannel = ADK.Messaging.getChannel('immunization');

    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #remove-immunization': 'removeImmunization',
            'click #back-eie': 'goBack'
        },
        goBack: function(){
            console.log('eie back');
        },
        removeImmunization: function(){
            console.log('removed!');
        },
        template: FooterTemplate

    });

});
