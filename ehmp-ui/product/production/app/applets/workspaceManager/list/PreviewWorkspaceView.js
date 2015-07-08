define([
    'underscore',
    'backbone',
    'marionette',
    'gridster',
    'hbs!app/applets/workspaceManager/list/previewWorkspaceTemplate',
], function(_, Backbone, Marionette, gridster, previewWorkspaceTemplate) {

    'use strict';

    var PreviewWorkspaceView = Backbone.Marionette.ItemView.extend({
        template: previewWorkspaceTemplate,
        initialize: function(options) {
            this.model = new Backbone.Model();
            this.model.set({
                'screenId': options.screenId,
                'screenTitle': options.screenTitle
            });
            var template = ADK.UserDefinedScreens.getGridsterTemplateForPreview(ADK.ADKApp[options.screenId]);
            if (options.screenId === 'documents-list')
                template = this.getTemplateForDocumentsList();
            this.model.set('gridsterTemplate', template);
        },
        getTemplateForDocumentsList: function() {
            //this is a special case for documents-list only
            return '<div id="gridsterPreview" class="gridster"><ul><li tabindex="0" data-row="1" data-col="1" data-sizex="12" data-sizey="8" ><br><div class="formatButtonText"><p class="applet-title">Documents<p>expanded</div></ul></div>';

        },
        setContinerHeight: function() {
            this.$el.find('.workspaceManagerForms').height($(window).height() + 'px');
        },
        onRender: function() {
            var self = this;
            this.setContinerHeight();
            $(window).resize(function() {
                self.setContinerHeight();
                self.setGridsterBaseDimension();
                self.setFontSize();
            });
        },
        onShow: function() {
            //first element to focus for 508
            this.$el.find('.wsTitle').focus();
            this.initGridster();
            this.setFontSize();
        },
        setFontSize: function() {
            var col = this.getHighestGridsterCol();
            var font = '1.2em';
            if (col > 40) {
                font = '.7em';
            } else if (col > 30) {
                font = '.8em';
            } else if (col > 20) {
                font = '1em';
            }

            this.$el.find('.formatButtonText p').css('font-size', font);
        },
        getHighestGridsterCol: function() {
            return Math.max(12, this.gridster.get_highest_occupied_cell().col);
        },
        getGridsterDimension: function() {
            var $container = this.$el.find('.gridsterContainer');
            var containerWidth = $container.width();
            var containerHeight = $container.height();
            var hightestCol = this.getHighestGridsterCol();
            var x = Math.floor(containerWidth / hightestCol) - 10;
            var y = (containerHeight * 0.9) / 12 - 10;
            return [x, y];
        },
        setGridsterBaseDimension: function() {
            this.gridster.resize_widget_dimensions({
                widget_base_dimensions: this.getGridsterDimension()
            });
        },
        initGridster: function() {
            this.gridster = this.$el.find(".gridsterContainer ul").gridster({
                namespace: '#gridsterPreview',
                widget_selector: "li",
                widget_base_dimensions: [1, 1],
                widget_margins: [5, 5],
                helper: 'clone',
                avoid_overlapped_widgets: true,
                autogrow_cols: true,
                min_cols: 100,
                resize: {
                    enabled: false
                },
                draggable: {
                    ignore_dragging: function() {
                        return true;
                    }
                }
            }).data('gridster');

            if (this.gridster) {
                this.setGridsterBaseDimension();
            }

        },
    });

    return PreviewWorkspaceView;


});