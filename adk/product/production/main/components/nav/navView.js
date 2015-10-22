define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/nav/navTemplate',
    'api/UserService',
    'api/Messaging',
    'api/Navigation',
    'api/ResourceService',
    'api/UserDefinedScreens',
    'main/Session'
], function(Backbone, Marionette, _, navTemplate, UserService, Messaging, Navigation, ResourceService, UserDefinedScreens, Session) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        model: UserService.getUserSession(),
        template: navTemplate,
        className: 'col-md-12 appNav',
        events: {
            'click #logoutButton': 'logout',
            'click #patientSearchButton': 'patientSearch',
            'click #current-patient-nav-header-tab': 'navigateToOverview'
        },
        modelEvents: {
            "change": "render"
        },
        initialize: function() {
            this.updatePatientName();
            this.listenTo(Session.patient, 'change:fullName', this.updatePatientName);
            var self = this;
            var promise = UserDefinedScreens.getScreensConfig();

            promise.done(function(screensConfig) {
                var screensToAddToTabList = _.filter(screensConfig.screens, function(screen) {
                    var hasPermission = true;
                    if (!_.isUndefined(screen.hasPermission) && screen.Permission === false) {
                        hasPermission = false;
                    }
                    var addNavigationTab = false;
                    if (!_.isUndefined(screen.addNavigationTab) && screen.addNavigationTab === true) {
                        addNavigationTab = true;
                    }
                    return (screen.addNavigationTab === true && hasPermission === true);
                });
                self.model.set('navTabs', screensToAddToTabList);
                _.each(self.model.get('navTabs'), function(screenTab) {
                    screenTab.finalID = screenTab.id.toLowerCase() + "-nav-header-tab";
                    screenTab.finalTitle = screenTab.title + " navigation tab";
                    self.events['click #' + screenTab.finalID] = function() {
                        Navigation.navigate(screenTab.routeName);
                    };
                });
            });
        },
        navigateToOverview: function(e) {
            e.preventDefault();
            Navigation.navigate('overview');
        },
        logout: function() {
            Messaging.trigger('app:logout');
        },
        patientSearch: function(e) {
            e.preventDefault();
            Navigation.navigate('patient-search-screen');
        },
        updatePatientName: function() {
            var name = ResourceService.patientRecordService.getCurrentPatient().get('fullName');
            if(_.isUndefined(name)){

                this.model.unset('patientName');
                this.model.unset('patientNavTabTitle');
            }else{
                this.model.set({
                    'patientName': ResourceService.patientRecordService.getCurrentPatient().get('fullName'),
                    'patientNavTabTitle': ResourceService.patientRecordService.getCurrentPatient().get('fullName') + " Overview Screen navigation tab",
                });
            }
        }
    });
});