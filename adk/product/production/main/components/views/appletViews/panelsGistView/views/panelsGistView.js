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
    "main/components/views/appletViews/TileSortManager"
], function($, _, Backbone, Utils, panelsGistLayoutTemplate, panelsGistChildTemplate, PopoverTemplate, ResourceService, Messaging, ToolbarView, TileSortManager) {
    'use strict';
    var AppletID = null;
    var PanelsGistItem = Backbone.Marionette.ItemView.extend({
        template: panelsGistChildTemplate,
        className: 'gistItem item',
        events: {
            'dragstart': function(event) {
                originalIndex = this.$el.index();
                this.$el.closest('div').css({
                    'box-shadow': '5px 5px 10px #888888;',
                    'margin-bottom': '10px;'
                });
            },
            'dragover': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$el.closest('div').css({
                    'border-top': '5px solid rgb(97, 157, 215)',
                    'box-shadow': '5px 5px 10px #888888;',
                    'margin-bottom': '10px;',
                    'background-color': '#f2f8fe'
                });
            },
            'dragleave': function(event) {
                event.preventDefault();
                this.$el.closest('div').css({
                    'border-top': '1px solid #f0f0f0',
                    'background-color': '#ffffff'
                });
            },
            'drop': function(event) {
                event.stopImmediatePropagation();
                var targetIndex = this.$el.index();

                if (originalIndex > targetIndex)
                    targetIndex++;

                var reorder = {
                    oldIndex: originalIndex,
                    newIndex: targetIndex - 1
                };
                this.$el.closest('div').css({
                    'border-top': '1px solid #f0f0f0',
                    'background-color': '#ffffff'
                });
                $(this.el).trigger('reorder', reorder);
            }
        },
        initialize: function(options) {
            this.AppletID = options.AppletID;
        },
        showPopover: function(evt, popoverElement) {
            evt.stopPropagation();
            $('[data-toggle=popover]').not(popoverElement).popover('hide');
            popoverElement.popover('toggle');
            var selectedGistItem = $(this.el);
            var gistPopover = $('.gistPopover');
            var widthAdjust = selectedGistItem.width() > gistPopover.width() ? gistPopover.width() : selectedGistItem.width();
            if (widthAdjust < selectedGistItem.width() * 0.85) {
                widthAdjust = selectedGistItem.width() * 0.85;
                gistPopover.width(widthAdjust);
            }
            var widthPxDiff = selectedGistItem.width() - widthAdjust;
            var offsetLeftToCenter = selectedGistItem.offset().left + (widthPxDiff * 0.5);
            gistPopover.css('left', offsetLeftToCenter.toString() + "px");
        },
        setPopover: function() {
            var self = this;
            var PopoverView = Backbone.Marionette.ItemView.extend({
                template: PopoverTemplate
            });
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'manual',
                html: 'true',
                container: 'body',
                template: (new PopoverView().template()),
                placement: 'bottom',
            }).click(function(evt) {
                self.showPopover(evt, $(this));
            }).focus(function(evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                $(this).keyup(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        self.showPopover(evt, $(this));
                    }
                });
            });
        },
        onRender: function() {
            this.setPopover();
            this.toolbar = new ToolbarView({
                targetElement: this,
                buttonTypes: ['infobutton', 'quicklookbutton']
            });
        }
    });
    var LabPanelsGist = Backbone.Marionette.CompositeView.extend({
        template: panelsGistLayoutTemplate,
        childView: PanelsGistItem,
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        events: {
            'click .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $('[data-toggle=popover]').popover('hide');
                this.sortCollection($(event.target));
            },
            'focus .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                $('[data-toggle=popover]').popover('hide');
                var currentHeaderFocus = $(event.target);
                var self = this;
                currentHeaderFocus.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        console.log("key pressed");
                        self.sortCollection(currentHeaderFocus);
                    }
                });
            },
            'reorder': 'reorderRows',
            'click .tilesort-remove-sort': function(event) {
                var instanceId = AppletID + '_' + this.options.appletId;

                event.preventDefault();
                event.stopImmediatePropagation();

                $('.tilesort-remove-sort', this.$el).remove();

                this.sortCollection($('.header:first', this.$el));

                TileSortManager.removeSort(instanceId);

            },
        },
        reorderRows: function(target, reorderObj) {
            var sortId = AppletID + '_' + this.options.appletId;
            TileSortManager.reorderRows(reorderObj, this.collection, sortId, 'uid');

            if ($('.tilesort-remove-sort', this.$el).length === 0) {
                $('.header:first', this.$el).append('<span type="button" class="tilesort-remove-sort" data-event="tilesort_remove-sort" title="Remove Manual Sort"> / Remove Manual <span  class="fa fa-times-circle"><span class="sr-only">Remove Manual Sort</span></span></span>');
            }
        },
        sortCollection: function(headerElement) {
            /* clear existing collection comparator to allow collection to rerender after sort */
            this.collection.comparator = null;
            if (headerElement.attr("sortable") === "true") {
                var nextSortOrder = '';
                switch (headerElement.attr("sortDirection")) {
                    case 'asc':
                        nextSortOrder = 'desc';
                        break;
                    case 'desc':
                        nextSortOrder = 'none';
                        break;
                    case 'none':
                        nextSortOrder = 'asc';
                        break;
                }
                this.$el.find('.header').attr("sortDirection", 'none');
                headerElement.attr("sortDirection", nextSortOrder);
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-up');
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-down');

                if (nextSortOrder === "asc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-up');
                } else if (nextSortOrder === "desc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-down');
                }

                if (nextSortOrder === 'none') {
                    Utils.CollectionTools.resetSort(this.collection);
                } else {
                    var sortType = headerElement.attr("sortType");
                    var key = headerElement.attr("sortKey");
                    Utils.CollectionTools.sort(this.collection, key, nextSortOrder, sortType);
                }
            }


        },
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            //var appletID = getAppletId(options);
            AppletID = getAppletId(options);
            this.childViewOptions = {
                AppletID: AppletID,
                collection: options.collection
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };

            this.collection = options.collection;
            this.gistModel = options.gistModel;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model({

            });
            this.model.set('gistHeaders', options.gistHeaders || {});
            this.model.set('AppletID', AppletID);
            this.childViewContainer = "#" + AppletID + "-panels" + "-gist-items";
            //this._super.initialize.apply(this, arguments);
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
        render: function() {
            console.log("rendering labPanelGistView ");
            this._super.render.apply(this, arguments);
        },
        onStop: function() {
            $('.labPanelPopover').popover('hide');
        },
        onRender: function() {}
    });

    function getAppletId(options) {
        if (_.isUndefined(options.appletConfig.instanceId)) {
            return options.appletConfig.id;
        } else {
            return options.appletConfig.instanceId;
        }
    }

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