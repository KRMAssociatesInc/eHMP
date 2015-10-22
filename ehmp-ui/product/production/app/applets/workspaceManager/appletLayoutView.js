define([
    'underscore',
    'backbone',
    'marionette',
    'hbs!app/applets/workspaceManager/list/screenEditor',
    'app/applets/workspaceManager/list/WorkspaceCollectionView',
    'hbs!app/applets/workspaceManager/list/deleteActiveTemplate',
    'gridster',
    'app/applets/workspaceManager/list/PreviewWorkspaceView'
], function(_, Backbone, Marionette, screenEditor, WorkspaceCollectionView, deleteActiveTemplate, gridster, PreviewWorkspaceView) {
    'use strict';

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        template: screenEditor,
        className: "workspaceManager-applet",
        initialize: function() {
            var self = this;
            this.model = new Backbone.Model();
            var screenModule = ADK.ADKApp[Backbone.history.fragment];
            var screenManagerChannel = ADK.Messaging.getChannel('managerAddScreen');
            screenManagerChannel.comply('deleteScreen', this.removeScreenActive, self);
        },
        regions: {
            managerRegion: '#list-group',
            activeRemoveRegion: '.deleteActiveRegion',
            previewRegion: '.previewRegion'
        },
        events: {
            'keyup #searchScreens': 'filterScreens',
            'click #clearSearch': 'clearSearch',
            'click #doneEditing': 'hideOverlay',
            'click .edit-applet': 'editClicked',
            'click .addScreen': 'triggerAddNew',
            'click .filterOpen': 'showFilterField',
            'click .delete-worksheet': 'removeScreenActive',
            'click .previewWorkspace': 'showPreview',
            'click .closePreview': 'hidePreview',
            'keydown [tabindex]:not(input)': 'handleSpacebarOrEnter'
        },
        hideOverlay: function() {
            ADK.UI.FullScreenOverlay.hide();
            ADK.Messaging.trigger('close:workspaceManager');
        },
        onBeforeAttach: function() {
            this.managerRegion.show(new WorkspaceCollectionView());
        },
        handleSpacebarOrEnter: function(e) {
            if (e.which === 13 || e.which === 32) {
                e.preventDefault();
                e.stopPropagation();
                $(e.target).click();
                return false;
            }
        },
        filterScreens: function() {
            var filterText = this.$el.find('#searchScreens').val();
            this.managerRegion.currentView.filterScreens(filterText);
            if (filterText) {
                this.$el.find('#clearSearch').css({
                    'display': 'inline',
                    'background-color': 'transparent',
                    'border': '0'
                });
            } else {
                this.$el.find('#clearSearch').css({
                    'display': 'none'
                });
            }
        },
        clearSearch: function() {
            this.$el.find('#searchScreens').val('');
            this.filterScreens();
            this.$el.find('#searchScreens').focus();
        },
        editScreen: function(e) {
            var title = $(e.currentTarget).find('p').text();
        },
        removeScreenActive: function(e) {
            var screenTitle = $(e.currentTarget).closest('.tableRow').find('input')[0].value;
            var screenId = $(e.currentTarget).closest('.row').attr('id');
            this.activeRemoveRegion.show(new DeleteActiveView({
                screenTitle: screenTitle,
                screenId: screenId
            }));
            this.$el.find('.cancelButton').focus();
        },
        triggerAddNew: function() {
            screenManagerChannel.command('addNewScreen');
        },
        showPreview: function(e) {
            var tableRow = $(e.target).closest('.row');
            var title = tableRow.find('.editor-input-element').val();
            title = (_.isUndefined(title) ? tableRow.find('.editor-title').text() : title);
            this.previewRegion.show(new PreviewWorkspaceView({
                screenId: tableRow.attr('id'),
                screenTitle: title
            }));
        },
        hidePreview: function(e) {
            this.previewRegion.empty();
        },
        showFilterField: function(e) {
            $('.hiddenRow').toggle();
        }

    });

    var screenManagerChannel = ADK.Messaging.getChannel('managerAddScreen');

    var DeleteActiveView = Backbone.Marionette.ItemView.extend({
        template: deleteActiveTemplate,
        initialize: function(options) {
            this.screenTitle = options.screenTitle;
            this.screenId = options.screenId;
            this.model = new Backbone.Model();
            this.model.set({
                screenTitle: this.screenTitle
            });
        },
        events: {
            'click .cancelButton': 'cancelAction',
            'click .deleteActiveScreen': 'deleteActive'
        },
        deleteActive: function() {
            ADK.ADKApp.ScreenPassthrough.deleteUserScreen(this.screenId);
            ADK.UI.FullScreenOverlay.hide();
            var channel = ADK.Messaging.getChannel('workspaceManagerChannel');
            channel.trigger('workspaceManager', function() {
                var view = new ADK.UI.FullScreenOverlay({
                    view: new AppletLayoutView(),
                    options: {
                        'callShow': true
                    }
                });
                view.show();
            });
        },
        cancelAction: function() {
            $('.deleteActiveScreenForm').hide();
            $('div[id="' + this.options.screenTitle + '"] .delete-worksheet').focus();
        }
    });

    return AppletLayoutView;
});