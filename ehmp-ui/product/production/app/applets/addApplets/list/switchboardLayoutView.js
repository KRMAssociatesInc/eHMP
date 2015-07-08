define([
    'underscore',
    'backbone',
    'marionette',
    'hbs!app/applets/addApplets/list/switchboardTemplate',
], function(_, Backbone, Marionette, switchboardTemplate) {

    var BeforeSwitchView = Backbone.Marionette.ItemView;
    var TitleView = Backbone.Marionette.ItemView;

    var SwitchboardLayoutView = Backbone.Marionette.LayoutView.extend({
        template: switchboardTemplate,
        className: 'view-switchboard',

        regions: {
            viewOptionsRegion: '.options-list',
            titleRegion: '.applet-title-switchboard'
        },
        initialize: function(options) {
            this.options = options;
            if (options.currentView) {
                this.currentView = options.currentView;
            }
            this.appletTitle = options.appletTitle.toUpperCase();
        },
        onRender: function() {
            var viewOptionsButtons = ADK.Messaging.request('switchboard : display', this.options);
            this.viewOptionsRegion.show(viewOptionsButtons);
            var titleHtml = this.appletTitle + " - SELECT A VIEW";
            TitleView = TitleView.extend({
                template: _.template(titleHtml)
            });
            this.titleRegion.show(new TitleView());
        },
        onShow: function() {
            $('.options-list ul li:first div:first').focus();
        },
        events: {
            'click .applet-exit-options-button': 'closeSwitchboard'
        },
        closeSwitchboard: function(e) {
            if (this.currentView) {
                var currentView = '<div class="edit-applet fa fa-cog"></div><br><div class="formatButtonText"><p class="applet-title">' + this.options.appletTitle + '</p>' + getViewTypeDisplay(this.currentView) + '</div>';
                currentView += '<span class="gs-resize-handle gs-resize-handle-both"></span>';
                BeforeSwitchView = BeforeSwitchView.extend({
                    template: _.template(currentView)
                });
                this.$el.closest('li').removeClass('bringToFront');
                this.options.region.show(new BeforeSwitchView());
            } else {
                console.error('Error: Cannot return to unspecified view');
            }

            function getViewTypeDisplay(type) {
                if (type === "gist") {
                    return "trend";
                } else {
                    return type;
                }
            }
        }
    });

    return SwitchboardLayoutView;

});