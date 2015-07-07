define([
    "jquery",
    "underscore",
    "main/Utils",
    "main/ADK",
    "backbone",
    "highcharts",
    "main/components/views/appletViews/eventsGistView/views/eventsBarGraphConfiguration",
    "hbs!main/components/views/appletViews/eventsGistView/templates/eventsGistLayout",
    "hbs!main/components/views/appletViews/eventsGistView/templates/eventsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging",
    'api/UserDefinedScreens',
    "main/components/appletToolbar/toolbarView",
    "main/components/views/appletViews/TileSortManager"
], function($, _, Utils, ADK, Backbone, highcharts, EventGistGraph, eventsGistLayoutTemplate, eventsGistChildTemplate, PopoverTemplate, ResourceService, Messaging, UserDefinedScreens, ToolbarView, TileSortManager) {
    'use strict';
    var AppletID = null;
    var CurrentPopover = null;
    var originalIndex;
    var showInfoButton = null;
    var showLinksButton = null;

    var EventGistItem = Backbone.Marionette.ItemView.extend({
        template: eventsGistChildTemplate,
        className: 'gistItem item',
        attributes: {
            'tabindex' : 0
        },
        chartPointer: null,
        events: {
            'click button.groupItem': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            },
            'click .highcharts-container': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$el.find('[data-toggle=popover]').trigger('click');
            },
            'click .quickviewOverlay': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$el.find('[data-toggle=popover]').trigger('click');
            },
            'click .info-display': function(event) {
                $('[data-toggle=popover]').popover('hide');
                //event.preventDefault();
                //event.stopImmediatePropagation();
            },
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
        createPopover: function() {
            var self = this;
            var PopoverView = Backbone.Marionette.ItemView.extend({
                template: PopoverTemplate
            });
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'manual',
                html: 'true',
                container: 'body',
                template: (new PopoverView().template()),
                placement: 'bottom'
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
        onDomRefresh: function() {
            //highcharts can't be rendered without the dom being completely loaded.
            //render highcharts
            var config = this.options.binningOptions;
            var chartConfig = new EventGistGraph(this.model.get('graphData'));
            this.chartPointer = $('#graph_' + this.model.get('id'));
            if (config) {
                config.chartWidth = (this.chartPointer).width();
                config.chartWidth = config.chartWidth === 0 ? 100 : config.chartWidth;
                chartConfig.series[0].data = Utils.chartDataBinning(this.model.get('graphData'), config);
            }
            this.chartPointer.highcharts(chartConfig);
            this.createPopover();
        },
        onBeforeDestroy: function() {
            if (this.chartPointer && this.chartPointer.length > 0) {
                var chart = this.chartPointer.highcharts();
                if (chart) {
                    chart.destroy();
                }
            }
            if (this.toolbar) {
                this.toolbar.destroy();
            }
            $('[data-toggle=popover]').popover('hide');
        },
        initialize: function() {
            //this.toolbar = new ToolbarView({targetElement:this});
            //this.toolbar.render();
        },
        onRender: function() {
            var buttonTypes = [];
            var tlbrOpts = {
                targetElement: this,
            };

            if (showInfoButton){
                buttonTypes.push('infobutton'); //'infobutton'
            }

            buttonTypes.push('detailsviewbutton');
            buttonTypes.push('quicklookbutton');

            if (showLinksButton) {
                buttonTypes.push('submenubutton');
                tlbrOpts.submenuItems = [];
                tlbrOpts.submenuTitle = 'Select Associated Workspace';
                if (!_.isUndefined(this.model.get('snomedCode'))) {
                    UserDefinedScreens.getScreenBySnomedCt(this.model.get('snomedCode')).done(function(filteredScreenList) {
                        if (filteredScreenList.length > 0) {
                            _.each(filteredScreenList, function(filteredScreen) {
                                var scrnObj = {
                                    displayText: filteredScreen.title,
                                    url: ('#' + filteredScreen.routeName)
                                };
                                tlbrOpts.submenuItems.push(scrnObj);
                            });
                        }
                    });
                }
            }
            tlbrOpts.buttonTypes = buttonTypes;

            //$(".col-sm-6.quickDraw.selectable.info-display.noPadding *").hover(
            /*
                function() {
                    $(this).css({
                        'background-color': '#f2f8fe'
                    });
                },
                function() {
                    $(this).css({
                        'background-color': '#ffffff'
                    });
                }
            );
            */
            this.toolbar = new ToolbarView(tlbrOpts);
        }
    });

    var EventGist = Backbone.Marionette.CompositeView.extend({
        template: eventsGistLayoutTemplate,
        childView: EventGistItem,
        manualOrder: false,
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
            var sortId = this.options.instanceId + '_' + this.options.appletId;
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
            var instanceId = this.options.instanceId + '_' + this.options.appletId;

            this.manualOrder = false;
            this.sortCollection($('.header:first', this.$el));
            TileSortManager.removeSort(instanceId);
        },
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            AppletID = getAppletId(options);
            showInfoButton = options.showInfoButton === false ? false : true;
            showLinksButton = options.showLinksButton || false;

            this.childViewOptions = {
                AppletID: AppletID,
                binningOptions: options.binningOptions
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };
            this.collection = options.collection;
            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('gistHeaders', options.gistHeaders || {
                name: '',
                description: '',
                grapic: 'Dose',
                age: 'Age',
                count: 'Count'
            });
            this.gistModel = options.gistModel;
            this.model.set('appletID', AppletID);
            this.childViewContainer = "#" + AppletID + "-event" + "-gist-items";
            /*this.collection.on("reset", function() {
                    console.log("Gist ----->> Collection reset -->>GistView");
                    console.log(this.collection);
            }, this);*/
            //render the toolbar view
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
                    var sortId = this.options.instanceId + '_' + this.options.appletId;
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

            var sortId = this.options.instanceId + '_' + this.options.appletId;
            var self = this;
            TileSortManager.getSortOptions(this.collection, sortId, function(wasSorted) {
                if (wasSorted) {
                    self.addManualOrder();
                }
            });
        },
        render: function() {
            this._super.render.apply(this, arguments);
        }
    });

    function getAppletId(options) {
        if (_.isUndefined(options.appletConfig.instanceId)) {
            if (_.isUndefined(options.appletConfig.gistSubName)) {
                return options.appletConfig.id;
            } else {
                return options.appletConfig.id + options.appletConfig.gistSubName;
            }
        } else {
            if (_.isUndefined(options.appletConfig.gistSubName)) {
                return options.appletConfig.instanceId;
            } else {
                return options.appletConfig.instanceId + options.appletConfig.gistSubName;
            }
        }
    }

    var EventGistView = {
        create: function(options) {
            var eventGistView = new EventGist(options);
            return eventGistView;
        },
        getView: function() {
            return EventGist;
        }
    };

    return EventGistView;
});
