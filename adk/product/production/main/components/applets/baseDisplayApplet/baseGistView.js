define([
    'jquery',
    'underscore',
    'backbone',
    'main/Utils',
    'main/components/views/appletViews/TileSortManager',
    'api/Messaging'
], function($, _, Backbone, Utils, TileSortManager, Messaging) {
    'use strict';

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

    var BaseGistView = Backbone.Marionette.CompositeView.extend({
        manualOrder: false,
        reorderOnSort: true, //performance enhancement when inverting
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        events: {
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
            'click .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                this.hidePopovers();
                this.sortCollection($(event.target));

            },
            'focus .header': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var currentHeaderFocus = $(event.target);
                var self = this;

                this.hidePopovers();

                currentHeaderFocus.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        self.sortCollection(currentHeaderFocus);
                    }
                });
            },
            'focusout .header': function(event) {
                var currentHeaderFocus = $(event.target);
                currentHeaderFocus.off('keypress');
            }
        },
        childEvents: {
            'before:showtoolbar': function(e) {
                Messaging.getChannel('gists').trigger('close:gists');
                this.hidePopovers();
                this.closeToolbar();
            },
            'after:showtoolbar': function(e, view) {
                this.activeToolbar = view;
            },
            'after:hidetoolbar': function(e) {
                this.activeToolbar = '';
                this.hidePopovers();
            },
            //reopens toolbar if open when repositioned
            'after:dragstart': function(e) {
                if (this.activeToolbar) {
                    this.sortItemModel = e.model;
                }
            },
            'after:drop': function(e) {
                if (this.sortItemModel) {
                    this.children.findByModel(this.sortItemModel).showToolbar();
                }
            },
            'toggle:quicklook': function(e) {
                var el = $(e.ui.popoverEl);
                Messaging.getChannel('gists').trigger('close:quicklooks', el);
                el.popup('toggle');
            },
        },
        onAddChild: function(child) {
            if (!child.model.get('applet_id')) {
                child.model.set('applet_id', this.AppletID);
            }
        },
        initialize: function(options) {
            this.appletOptions = options;
            this.AppletID = getAppletId(options);

            this.listenTo(Messaging.getChannel('gists'), 'close:gists', function(e) {
                this.closeToolbar();
            });
            this.listenTo(Messaging.getChannel('gists'), 'close:quicklooks', function(el) {
                this.$('[data-toggle=popover]').not(el).popup('hide');
            });
        },
        render: function() {
            if (!this.appletOptions.enableTileSorting) {
                this.off('reorder');
                this.$el.unbind('[data-event="tilesort_remove-sort"]', 'click');
                this.$el.unbind('[data-event="tilesort_remove-sort"]', 'focus');
            }

            this.collection = this.collectionParser(this.collection);
            this.unsortedModels = this.collection.clone().models;
            var sortId = this.options.appletConfig.instanceId + '_' + this.options.appletConfig.id;
            var self = this;

            TileSortManager.getSortOptions(this.collection, sortId, this.appletOptions.tileSortingUniqueId, function(wasSorted, newCollection) {

                self.collection = newCollection;
                self.manualSortModels = newCollection.models;

                _.each(self.collection.models, function(item) {
                    _.each(self.gistModel, function(object) {
                        item.set(object.id, item.get(object.field));
                    });
                }, self);

                if (wasSorted) {
                    self.manualOrder = true;
                    self.addManualOrder();
                    self.collection.comparator = null;
                }

                Backbone.Marionette.CompositeView.prototype.render.apply(self, arguments);
            });
        },
        onRender: function() {
            if (this.manualOrder) {
                this.addManualOrder();
            }

            if (this.appletOptions.enableTileSorting) {
                var self = this;
                var extraCssClasses = this.options.appletConfig.id === 'activeMeds' ? 'col-sm-12' : '';
                $(this.el).find('.gistItemList, .gistList').append('<div class="placeholder hidden ' + extraCssClasses + '"/>');
                $(this.el).find('.placeholder').on('dragover', function(e) {
                    e.preventDefault();
                });

                $(this.el).find('.placeholder').on('drop', function(e) {
                    var data = e.originalEvent.dataTransfer.getData('text');
                    var startTileObject = JSON.parse(data);

                    var originalAppletId = startTileObject.appletID;
                    if (originalAppletId != self.AppletID)
                        return;

                    var originalIndex = Number(startTileObject.startIndex);
                    //targetIndex = this.$el.index();
                    var targetIndex = $(this).index() - 1;
                    $(this).addClass('hidden');

                    if (originalIndex > targetIndex)
                        targetIndex++;

                    var reorder = {
                        oldIndex: originalIndex,
                        newIndex: targetIndex
                    };

                    self.reorderRows(e, reorder);

                    if (self.sortItemModel) {
                        self.children.findByModel(self.sortItemModel).showToolbar();
                    }
                });

                var gridAppletPanel = $('#' + this.options.appletConfig.instanceId).find('.grid-applet-panel').first();
                $('<div id="' + this.options.appletConfig.instanceId + '-scroll-bottom" style="position: relative; top: -10px; height: 10px;"/>').insertAfter($(gridAppletPanel)).on('dragenter', function(e) {
                    self.bottomInterval = setInterval(function() {
                        var newScrollTop = $(gridAppletPanel).scrollTop();
                        $(gridAppletPanel).scrollTop(newScrollTop + 10);
                    }, 25);
                }).on('dragleave', function(e) {
                    self.bottomInterval && clearInterval(self.bottomInterval);
                });

                $('<div id="' + this.options.appletConfig.instanceId + '-scroll-top" style="position: relative; top: 0px; height: 4px; background-color: white;"/>').insertBefore($(gridAppletPanel)).on('dragenter', function(e) {
                    self.topInterval = setInterval(function() {
                        var newScrollTop = $(gridAppletPanel).scrollTop();
                        $(gridAppletPanel).scrollTop(newScrollTop - 10);
                    }, 25);
                }).on('dragleave', function(e) {
                    self.topInterval && clearInterval(self.topInterval);
                });
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
                    this.collection.reset(this.manualSortModels);
                } else {
                    var sortType = headerElement.attr("sortType");
                    var key = headerElement.attr("sortKey");
                    Utils.CollectionTools.sort(this.collection, key, nextSortOrder, sortType);
                }
            }
        },
        reorderRows: function(target, reorderObj) {
            var sortId = this.options.appletConfig.instanceId + '_' + this.options.appletConfig.id;
            TileSortManager.reorderRows(reorderObj, this.collection, sortId, this.appletOptions.tileSortingUniqueId);

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
            var instanceId = this.options.appletConfig.id + '_' + this.options.appletId;

            this.manualOrder = false;
            this.sortCollection($('.header:first', this.$el));
            TileSortManager.removeSort(instanceId);
        },
        clickTileRemoveSort: function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.removeManualOrder();
        },
        focusTileRemoveSort: function(event) {
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
        closeToolbar: function(e) {
            var childView = this.$childViewContainer;
            if (childView && this.activeToolbar) {
                this.activeToolbar.hide();
                childView.find('.toolbarActive').removeClass('toolbarActive');
            }
            this.activeToolbar = null;
        },
        hidePopovers: function(e) {
            Messaging.getChannel('gists').trigger('close:quicklooks');
        },
        onDestroy: function(e) {
            $(this.el).find('.placeholder').remove();
            $('#' + this.options.appletConfig.instanceId + '-scroll-top').remove();
            $('#' + this.options.appletConfig.instanceId + '-scroll-bottom').remove();
        }
    });

    var Orig = BaseGistView, //create a new object structure so that children inherit the render and initialize functions
        Modified = Orig.extend({
            constructor: function() {
                if (!this.options) this.options = {};
                var args = Array.prototype.slice.call(arguments),
                    init = this.initialize,
                    onAddChild = this.onAddChild,
                    onRender = this.onRender,
                    onDestroy = this.onDestroy,
                    argEvents = (args[0]) ? _.extend({}, this.options.events || {}, args[0].events) : _.extend({}, this.options.events);
                this.initialize = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.initialize.apply(this, args);
                    if (Orig.prototype.initialize === init) return;
                    init.apply(this, args);
                };
                this.onAddChild = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.onAddChild.apply(this, args);
                    if (Orig.prototype.onAddChild === onAddChild) return;
                    onAddChild.apply(this, args);
                };
                this.onDestroy = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.onDestroy.apply(this, args);
                    if (Orig.prototype.onDestroy === onDestroy) return;
                    onDestroy.apply(this, args);
                };
                this.onRender = function() {
                    var args = Array.prototype.slice.call(arguments);
                    onRender.apply(this, args);
                    if (Orig.prototype.onRender === onRender) return;
                    Orig.prototype.onRender.apply(this, args);
                };
                this.events = _.extend({}, (typeof Orig.prototype.events == 'function') ? Orig.prototype.events() : Orig.prototype.events, (typeof this.events == 'function') ? this.events() : this.events, (typeof argEvents == 'function') ? argEvents() : argEvents);
                if (args[0] && args[0].events) {
                    delete args[0].events; //required or else Backbone will destroy our inherited events
                }
                if (this.options.events) {
                    delete this.options.events; //required or else Backbone will destroy our inherited events
                }
                Orig.apply(this, args);
            }
        });
    BaseGistView = Modified;

    return BaseGistView;
});