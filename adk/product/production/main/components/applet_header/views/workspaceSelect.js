/**
 * Created by kuruczd on 3/23/15.
 */
define([
    'api/Navigation',
    'backbone',
    'marionette',
    'underscore',
    'hbs!main/components/applet_header/templates/workspaceSelect',
    "api/UserDefinedScreens",
    'main/components/applet_header/navView',
    'api/Messaging'
], function(Navigation, Backbone, Marionette, _, workspaceSelectTemplate, UserDefinedScreens, navView, Messaging) {
    'use strict';

    return Marionette.ItemView.extend({
        template: workspaceSelectTemplate,
        events: {
            'click .dropdown-menu a': 'navigate',
            'click #plus-button': 'addApplets',
            'click #workspace-manager-button': 'workspaceManager',
            'keyup #dropdown-search-element': 'filterScreens',
            'click ul.dropdown-menu #clearSearch': 'clearFilteredMenu',
        },
        initialize: function() {
            $('ul.dropdown-menu #clearSearch').hide();
            this.listenTo(ADK.Messaging, 'close:workspaceManager', this.updateWorkspaceList);
        },
        onRender: function() {
            var input = $('.dropdown-menu li #dropdown-search-element');
            input.click(function(e) {
                e.stopPropagation();
            });
            input.keydown(function(e) {
                e.stopPropagation();
            });
            input.val('');
            input.focus();
            input.val(this.filterText);
            $('.dropdownContainer').mousedown(function(e){
                if($(e.target).hasClass('dropdownContainer')) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },
        modelEvents: {
            'change:currentScreen': 'currentScreenChanged',
            'change:screens': 'changeScreens'
        },
        updateWorkspaceList: function() {
            this.filterText = '';
            UserDefinedScreens.getScreensConfig().done(function(screensConf) {
                this.model.set("screens", screensConf.screens);
                this.model.set("originalScreens", screensConf.screens);
            }.bind(this));
            $('ul.dropdown-menu #clearSearch').css("display", "none");
        },

        changeScreens: function() {
            this.render();
            this.currentScreenChanged();
        },
        onShow: function() {
            this.updateWorkspaceList();
        },
        navigate: function(event) {
            var href;
            $('.dropdown-menu li.active').removeClass('active');
            if ($(event.currentTarget).attr('href')) {
                href = $(event.currentTarget).attr('href');
            } else {
                href = $(event.currentTarget).attr('class');
            }
            Navigation.navigate(href);
        },

        currentScreenChanged: function() {
            var screenId = Messaging.request('get:current:screen').id;
            this.$el.find('.active').removeClass('active');
            var clickedText = $(this.el.getElementsByClassName(screenId + '-button')).addClass('active').text().trim();

            if (clickedText !== "") {
                this.$el.find("#screenName").text(clickedText);
            } else if (screenId === "record-search") {
                this.$el.find("#screenName").text("Search Record");
            } else if (screenId.indexOf("-full") > -1) {
                this.$el.find("#screenName").text(this.model.get('currentScreen').applets[0].title);
            }
            var isNonPatientCentricView = (!_.isUndefined(this.model.get("currentScreen").nonPatientCentricView) &&
                this.model.get("currentScreen").nonPatientCentricView === true);

            if (this.model.get('currentScreen').predefined === false || isNonPatientCentricView) {
                this.$el.find('#plus-button').show();
            } else {
                this.$el.find('#plus-button').hide();
            }
        },
        addApplets: function(event) {
            var channel = Messaging.getChannel('addAppletsChannel');
            channel.trigger('addApplets');
        },
        workspaceManager: function(event) {
            var channel = Messaging.getChannel('workspaceManagerChannel');
            channel.trigger('workspaceManager');
        },
        filterScreens: function() {
            var filterText = this.$el.find('#dropdown-search-element').val();
            this.filterText = filterText;
            this.filterMenu(filterText);
        },
        filterMenu: function(filterText) {
            var filteredScreens = _.filter(this.model.get('originalScreens'), function(screen) {
                return screen.title.toLowerCase().indexOf(filterText.toLowerCase()) >= 0;
            });
            this.model.set('screens', filteredScreens);
            $('ul.dropdown-menu #clearSearch').css("display", "inline");
            if (this.filterText === '') {
                $('ul.dropdown-menu #clearSearch').css("display", "none");
            } else {
                $('ul.dropdown-menu #clearSearch').css("display", "inline");
            }
        },
        clearFilteredMenu: function(e) {
            e.stopPropagation();
            this.filterText = '';
            UserDefinedScreens.getScreensConfig().done(function(screensConf) {
                this.model.set("screens", screensConf.screens);
                this.model.set("originalScreens", screensConf.screens);
            }.bind(this));
            $('ul.dropdown-menu #clearSearch').css("display", "none");

        }
    });
});