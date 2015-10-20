define([
    "jquery",
    "underscore",
    "backbone",
    "main/Utils",
    "hbs!main/components/views/appletViews/panelsGistView/templates/panelsGistLayout",
    "hbs!main/components/views/appletViews/panelsGistView/templates/panelsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging",
    "main/components/appletToolbar/toolbarView",
    "main/components/views/appletViews/TileSortManager",
    'main/components/applets/baseDisplayApplet/baseDisplayAppletItem',
    'main/components/applets/baseDisplayApplet/baseGistView',
], function($, _, Backbone, Utils, panelsGistLayoutTemplate, panelsGistChildTemplate, popoverTemplate, ResourceService, Messaging, ToolbarView, TileSortManager, BaseAppletItem, BaseGistView) {
    'use strict';
    var AppletID = null;
    var PanelsGistItem = BaseAppletItem.extend({
        template: panelsGistChildTemplate,
        className: 'gistItem item',
        regions: {
            toolbarView: '.toolbarContainer'
        },
        attributes: {
            'tabindex': 0
        },
        ui: {
            popoverEl: '[data-toggle=popover]',
            toolbarToggler: '.selectable:not([data-toggle=popover])'
        },
        events: {
            'click .selectable:not([data-toggle=popover])': function(e) {
                var toolbarView = this.toolbarView.currentView;
                this.trigger('before:showtoolbar');
                toolbarView.show();
                this.$el.addClass('toolbarActive');
                this.trigger('after:showtoolbar', toolbarView);
            }
        },
        createPopover: function() {
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'click',
                html: 'true',
                container: 'body',
                template: popoverTemplate(this.model),
                placement: 'bottom',
            });
        },
        onRender: function() {
            this.createPopover();
            var toolbarView = new ToolbarView({
                targetElement: this,
                buttonTypes: ['infobutton', 'quicklookbutton']
            });
            this.toolbarView.show(toolbarView);
        },
        onDestroy: function() {
            this.ui.popoverEl.popup('destroy');
        }
    });
    var LabPanelsGist = BaseGistView.extend({
        template: panelsGistLayoutTemplate,
        childView: PanelsGistItem,
        initialize: function(options) {
            this.childViewOptions = {
                AppletID: this.AppletID,
                collection: options.collection
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };

            this.collection = options.collection;
            this.gistModel = options.gistModel;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();

            this.model.set('gistHeaders', options.gistHeaders || {});
            this.model.set('AppletID', this.AppletID);
            this.childViewContainer = "#" + this.AppletID + "-panels" + "-gist-items";
        },
        onBeforeRender: function() {
            this.collection.reset(this.collectionParser(this.collection).models);
            _.each(this.collection.models, function(item) {
                _.each(this.gistModel, function(object) {
                    var id = object.id;
                    item.set(object.id, item.get(object.field));
                });
            }, this);
            var sortId = AppletID + '_' + this.options.appletId;
            TileSortManager.getSortOptions(this.collection, sortId);
        },
    });

    var LabPanelsGistView = {
        create: function(options) {
            var LabPanelsGistView = new LabPanelsGist(options);
            return LabPanelsGistView;
        },
        getView: function() {
            return LabPanelsGist;
        }
    };

    return LabPanelsGistView;
});