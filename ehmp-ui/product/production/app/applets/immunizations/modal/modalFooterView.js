define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/immunizations/modal/footerTemplate'
], function(Backbone, Marionette, _, FooterTemplate) {
    'use strict';

    var immunizationChannel = ADK.Messaging.getChannel('immunization');

    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #edit-immunization': 'editImmunization',
            'click #error': 'enteredInError'
        },
        templateHelpers: function() {
            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = this.model.get('pid') ? this.model.get('pid').split(';')[0] : '';

            if (ADK.UserService.hasPermission('add-patient-immunization') && (pidSiteCode === siteCode)) {
                return {
                    enableWriteback: true
                };
            } else {
                return {
                    enableWriteback: false
                };
            }
        },
        onRender: function() {
           $(document.body).tooltip({
                selector: '.modal-footer .tooltip-wrapper',
                delay: {
                    "show": 300,
                    "hide": 0
                }
            });
        },
        editImmunization: function(){
            immunizationChannel.command('openImmunizationModal', 'immunization_edit', this.model);
        },
        enteredInError: function(event) {
            immunizationChannel.command('immunizationEiE:clicked', 'immunization_eie', this.model);
        },
        template: FooterTemplate

    });

});
