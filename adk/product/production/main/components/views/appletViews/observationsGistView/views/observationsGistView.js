define('main/components/views/appletViews/observationsGistView/views/observationsGistView', [
    "jquery",
    "underscore",
    "backbone",
    "main/Utils",
    "hbs!main/components/views/appletViews/observationsGistView/templates/observationsGistLayout",
    "hbs!main/components/views/appletViews/observationsGistView/templates/observationsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging",
    "main/components/appletToolbar/appletToolbarView",
    "main/components/views/appletViews/TileSortManager",
    "main/components/applets/baseDisplayApplet/baseDisplayAppletItem",
    "main/components/applets/baseDisplayApplet/baseGistView"
], function($, _, Backbone, Utils, observationsGistLayoutTemplate, observationsGistChildTemplate, popoverTemplate, ResourceService, Messaging, ToolbarView, TileSortManager, BaseAppletItem, BaseGistView) {
    'use strict';

    var ObservationsGistItem = BaseAppletItem.extend({
        template: observationsGistChildTemplate,
        disableNoRecordClick: function() {
            var gistItem = this.$el;
            if (gistItem.find('.no-record').length > 0) {
                //remove the selectable class if no-record
                gistItem.find('.selectable').removeClass('selectable');
                //remove the tooltip if no-record (this is a workaround till the toolbar will be able to disable buttons)
                gistItem.find('[data-toggle]').removeAttr('data-toggle').removeAttr('data-content');
            }
        },
        onRender: function() {
            this.disableNoRecordClick();
        },
        initialize: function() {
            var buttonTypes = ['infobutton', 'detailsviewbutton', 'quicklookbutton'];
            if (!Messaging.request('get:current:screen').config.predefined) {
                buttonTypes.unshift('tilesortbutton');
            }
            if (this.appletOptions.appletConfig.id === "lab_results_grid") buttonTypes.push('additembutton');

            this.toolbarOptions = {
                targetElement: this,
                buttonTypes: buttonTypes
            };
        },
        onDomRefresh: function() {
            this.$('svg.gistTrendGraph').attr('focusable', 'false');
        }
    });

    var ObservationsGist = BaseGistView.extend({
        template: observationsGistLayoutTemplate,
        childView: ObservationsGistItem,

        initialize: function(options) {
            this.childViewOptions = {
                AppletID: this.AppletID,
                collection: options.collection,
                appletOptions: options
            };
            this.gistModel = options.gistModel;
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };

            this.collection = options.collection;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('gistHeaders', options.gistHeaders);
            this.model.set('AppletID', this.AppletID);
            this.childViewContainer = "#" + this.AppletID + "-observations-gist-items";
        },
    });

    var ObservationsGistView = {
        create: function(options) {
            var observationsGistView = new ObservationsGist(options);
            return observationsGistView;
        },
        getView: function() {
            return ObservationsGist;
        }
    };

    return ObservationsGistView;
});