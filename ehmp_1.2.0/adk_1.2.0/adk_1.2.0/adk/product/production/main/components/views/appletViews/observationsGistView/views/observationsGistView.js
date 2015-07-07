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
    "main/components/appletToolbar/toolbarView",
    "main/components/views/appletViews/TileSortManager"


], function($, _, Backbone, Utils, observationsGistLayoutTemplate, observationsGistChildTemplate, PopoverTemplate, ResourceService, Messaging, ToolbarView, TileSortManager) {
    'use strict';
    var AppletID = null;
    var originalIndex;

    var ObservationsGistItem = Backbone.Marionette.ItemView.extend({
        template: observationsGistChildTemplate,
        className: 'gistItem item',
        attributes: {
            'tabindex' : 0
        },
        events: {
            'click button.groupItem': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            },/*,
            'click div.gistItem': function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.$el.find('[data-toggle=popover]').trigger('click');
                }*/
            'dragstart': function (event) {
                originalIndex = this.$el.index();
                 this.$el.closest('div').css({
                    'box-shadow': '5px 5px 10px #888888;',
                    'margin-bottom': '10px;'
                });
            },
            'dragover': function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$el.closest('div').css({
                    'border-top':'5px solid rgb(97, 157, 215)',
                    'box-shadow': '5px 5px 10px #888888;',
                    'margin-bottom': '10px;',
                    'background-color': '#f2f8fe'
                });
            },
            'dragleave': function (event) {
                event.preventDefault();
                this.$el.closest('div').css({
                    'border-top':'1px solid #f0f0f0',
                    'background-color': '#ffffff'
                });
            },
            'drop': function (event) {
                event.stopImmediatePropagation();
                var targetIndex =  this.$el.index();

                if(originalIndex > targetIndex)
                    targetIndex++;

                var reorder = {
                    oldIndex: originalIndex,
                    newIndex: targetIndex-1
                };
                this.$el.closest('div').css({
                    'border-top':'1px solid #f0f0f0',
                    'background-color': '#ffffff'
                });
                $(this.el).trigger('reorder', reorder);
            }

        },

        showPopover: function(evt, popoverElement) {
            evt.stopPropagation();
            $('[data-toggle=popover]').not(popoverElement).popover('hide');
            popoverElement.popover('toggle');
            var selectedGistItem = $(this.el);
            var widthAdjust = selectedGistItem.width() * 0.85;
            var leftAdjust = selectedGistItem.offset().left;
            var widthPxDiff = selectedGistItem.width() - widthAdjust;
            var offsetLeftToCenter = selectedGistItem.offset().left + (widthPxDiff * 0.5);
            $('.gistPopover').css('left', offsetLeftToCenter.toString() + "px");
            $('.gistPopover').width(widthAdjust);

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
        disableNoRecordClick: function() {
            var gistItem = this.$el;
            if (gistItem.find('.no-record').length > 0) {
                //remove the selectable class if no-record
                gistItem.find('.selectable').removeClass('selectable');
                //remove the tooltip if no-record (this is a workaround till the toolbar will be able to disable buttons)
                gistItem.find('[data-toggle]').removeAttr('data-toggle').removeAttr('data-content');
            }

        },
        initialize: function(options) {
            this.applet_id = AppletID;
        },
        onRender: function() {
            this.disableNoRecordClick();
            this.setPopover();

            var buttonTypes = ['infobutton', 'detailsviewbutton','quicklookbutton'];
            if (Messaging.request('get:current:screen').config.id.indexOf('workspace') >= 0) {
                buttonTypes.unshift('tilesortbutton');
            }
            this.toolbar = new ToolbarView({
                targetElement: this,
                buttonTypes: buttonTypes
            });

            //this fixes the hover style issue with toolbar
            $( ".col-sm-6.quickDraw.selectable.border-vertical.info-display.noPadding").hover(
              function() {
                $( this ).css({
                    'background-color': '#f2f8fe'
                });
              }, function() {
                $( this ).css({
                    'background-color': '#ffffff'
                });
              }
            );
        },
        onBeforeDestroy: function(){
            $('[data-toggle=popover]').popover('hide');
        }
    });
    var ObservationsGist = Backbone.Marionette.CompositeView.extend({
        template: observationsGistLayoutTemplate,
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        childView: ObservationsGistItem,
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

                var currentHeaderFocus = $(event.target);
                var self = this;

                $('[data-toggle=popover]').popover('hide');

                currentHeaderFocus.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        self.sortCollection(currentHeaderFocus);
                    }
                });
            },
            'focusout .header': function(event) {
                var currentHeaderFocus = $(event.target);
                currentHeaderFocus.off('keypress');
            },
            'reorder': 'reorderRows',
            'click [data-event="tilesort_remove-sort"]': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                this.removeManualOrder();
            },
            'focus [data-event="tilesort_remove-sort"]': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var removeSortFocus = $(event.target);
                var self = this;
                removeSortFocus.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        self.removeManualOrder();
                    }
                });
            },
        },
        reorderRows: function(target, reorderObj) {
            var sortId = this.options.appletConfig.instanceId + '_' + this.options.appletConfig.id;
            TileSortManager.reorderRows(reorderObj, this.collection, sortId, 'uid');

            if ($('.tilesort-remove-sort', this.$el).length === 0) {
                this.addManualOrder();

                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-up');
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-down');
            }
        },
        addManualOrder: function() {
            this.manualOrder = true;
            $('.header:first', this.$el).attr("sortDirection", 'manual');
            this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').addClass('header-hide');
            $('.header:first', this.$el).append('<span class="tilesort-remove-sort">/Manual ' +
                '<a title="Clear your manual sort" data-event="tilesort_remove-sort" role="button" aria-selected="false" tabindex="0">' +
                '<span class="sr-only">Clear your manual sort</span><i class="fa fa-times-circle"></i></a></span>');
        },
        removeManualOrder: function() {
            var instanceId = this.options.appletConfig.instanceId + '_' + this.options.appletConfig.id;

            this.manualOrder = false;
            this.sortCollection($('.header:first', this.$el));
            TileSortManager.removeSort(instanceId);
        },
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            AppletID = getAppletId(options);
            this.childViewOptions = {
                AppletID: AppletID,
                collection: options.collection
            };
            this.gistModel = options.gistModel;
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };

            this.collection = options.collection;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('gistHeaders', options.gistHeaders);
            this.model.set('AppletID', AppletID);
            this.childViewContainer = "#" + AppletID + "-observations-gist-items";
            this._super = Backbone.Marionette.CompositeView.prototype;
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
                        nextSortOrder = this.manualOrder ? 'manual' : 'none';
                        break;
                    case 'manual':
                        nextSortOrder = 'none';
                        break;
                    case 'none':
                        nextSortOrder = 'asc';
                        break;
                }
                this.$el.find('.header').attr("sortDirection", 'none');
                headerElement.attr("sortDirection", nextSortOrder);
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').addClass('header-hide');
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-up');
                this.$el.find('.header').find('[sortArrow=headerDirectionalIndicator]').removeClass('fa-caret-down');
                $('.tilesort-remove-sort', this.$el).remove();

                if (nextSortOrder === "asc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').removeClass('header-hide');
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-up');
                } else if (nextSortOrder === "desc") {
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').removeClass('header-hide');
                    headerElement.find('[sortArrow=headerDirectionalIndicator]').addClass('fa-caret-down');
                } else if (nextSortOrder === "manual") {
                    this.addManualOrder();
                }

                if (nextSortOrder === 'none') {
                    this.collection.reset(this.unsortedModels);
                } else if (nextSortOrder === 'manual') {
                    var sortId = this.options.appletConfig.instanceId + '_' + this.options.appletConfig.id;
                    TileSortManager.getSortOptions(this.collection, sortId);
                } else {
                    var sortType = headerElement.attr("sortType");
                    var key = headerElement.attr("sortKey");
                    Utils.CollectionTools.sort(this.collection, key, nextSortOrder, sortType);
                }
            }


        },
        onBeforeRender: function() {

            this.collection.reset(this.collectionParser(this.collection).models);
            _.each(this.collection.models, function(item) {

                _.each(this.gistModel, function(object) {
                    var id = object.id;
                    item.set(object.id, item.get(object.field));
                });
            }, this);

            this.unsortedModels = this.collection.clone().models;

            var sortId = this.options.appletConfig.instanceId + '_' + this.options.appletConfig.id;
            var self = this;
            TileSortManager.getSortOptions(this.collection, sortId, function(wasSorted) {
                if  (wasSorted) {
                    self.addManualOrder();
                }
            });
        },
        render: function() {
            this._super.render.apply(this, arguments);
        },
        onRender: function() {}
    });

    function getAppletId(options) {
        return options.appletConfig.id;
    }

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