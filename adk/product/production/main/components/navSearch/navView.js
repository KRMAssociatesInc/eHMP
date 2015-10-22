define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/navSearch/navTemplate',
    'api/UserService',
    'api/Messaging',
    'api/UserDefinedScreens',
    'api/Navigation'
], function(Backbone, Marionette, _, navTemplate, UserService, Messaging, UserDefinedScreens, Navigation) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        model: UserService.getUserSession(),
        template: navTemplate,
        className: 'col-md-12 appNav',
        events: {
            'click #logoutButton': 'logout',
            'click .navigation-tab': 'navigateToTabbedScreen'
        },
        initialize: function() {
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
                });
                self.render();
            });
        },
        navigateToTabbedScreen: function(e){
            var screenName = $(e.currentTarget).attr('route-id');
            console.log(screenName);
            if(screenName){
              Navigation.navigate(screenName);
            }
        },
        logout: function() {
            Messaging.trigger('app:logout');
        },

    });
});