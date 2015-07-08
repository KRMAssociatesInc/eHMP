define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/nav/navTemplate',
    'api/UserService',
    'api/Messaging',
    'api/Navigation',
    'api/ResourceService',
    'main/Session'
], function(Backbone, Marionette, _, navTemplate, UserService, Messaging, Navigation, ResourceService, Session) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        model: UserService.getUserSession(),
        template: navTemplate,
        className: 'col-md-12 appNav',
        events: {
            'click #logoutButton': 'logout',
            'click #patientSearchButton': 'patientSearch'
        },
        modelEvents: {
            "change": "render"
        },
        initialize: function() {
            this.updatePatientName();
            this.listenTo(Session.patient, 'change:fullName', this.updatePatientName);
        },
        logout: function() {
            Messaging.trigger('app:logout');
        },
        patientSearch: function(e) {
            e.preventDefault();
            Navigation.navigate('patient-search-screen');
        },
        updatePatientName: function() {
            this.model.set({
                'patientName': ResourceService.patientRecordService.getCurrentPatient().get('fullName')
            });
        }
    });
});