define([
    'jquery',
    'underscore',
    'main/Utils',
    'main/components/applets/baseDisplayApplet/view',
    'main/backgrid/datagrid',
    'main/backgrid/filter',
    'api/ResourceService',
    'api/SessionStorage',
    'main/components/views/loadingView',
    'main/components/views/errorView',
    'main/components/applets/grid_applet/views/filterDateRangeView',
    'hbs!main/components/applets/grid_applet/templates/containerTemplate',
    'main/components/applets/grid_applet/gists/gistView'
], function($, _, utils, BaseDisplayApplet, DataGrid, CollectionFilter, ResourceService, SessionStorage, LoadingView, ErrorView, FilterDateRangeView, containerTemplate, GistView) {
    'use strict';

    var SCROLL_TRIGGERPOINT = 40;
    var SCROLL_ADDITIONAL_ROWS = 100;
    var INITIAL_NUMBER_OF_ROWS = 30;


    // this.appletOptions = {
    //      filterFields
    //      filterDateRangeField
    //      collection
    //      onClickAdd              : method
    //      onClickRow              : method
    //      detailsView             : used by dataGrid
    //
    //      refresh                 : method (optional overwrite)
    //      appletConfig            : {id, instanceId, fullscreen}
    // }

    var baseDisplayApplet = BaseDisplayApplet;

    var GridView = BaseDisplayApplet.extend({
        initialize: function(options) {
            this._base = baseDisplayApplet.prototype;
            if (!this.options.appletConfig) {
                this.options.appletConfig = {};
                this.options.appletConfig.id = this.appletOptions.appletConfig.id;
                this.options.appletConfig.instanceId = this.appletOptions.appletConfig.instanceId;
                this.options.appletConfig.fullScreen = false;
                this.appletConfig = this.options.appletConfig;
            }

            var appletOptions = this.appletOptions || {}; //Set in extending view
            this.appletOptions = appletOptions;
            this.appletOptions.appletConfig = this.options.appletConfig;


            //Set Data Grid Columns
            if (this.options.appletConfig.fullScreen) {
                this.appletOptions.columns = appletOptions.fullScreenColumns || appletOptions.summaryColumns || appletOptions.columns;
            } else {
                this.appletOptions.columns = appletOptions.summaryColumns || appletOptions.columns;
            }

            //Create Data Grid View
            if (this.appletOptions.collection instanceof Backbone.PageableCollection) {
                if (this.options.appletConfig.fullScreen || this.options.appletConfig.fullScreen === true) {
                    this.appletOptions.collection.setPageSize(100, {
                        silent: true
                    });
                } else {
                    this.appletOptions.collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {
                        silent: true
                    });
                }

            }
            this.appletOptions.AppletView = DataGrid.returnView(this.appletOptions);
            this._base.initialize.apply(this, arguments);
        },
        onRender: function() {
            this._base.onRender.apply(this, arguments);
            if (this.appletOptions.collection instanceof Backbone.PageableCollection) {
                var self = this;
                if (!this.appletConfig.fullScreen || this.appletConfig.fullScreen !== true) {
                    this.$el.find('#grid-panel-' + this.appletConfig.instanceId).on('scroll', function(event) {
                        self.fetchRows(event);
                    });
                }

            }
        },
        fetchRows: function(event) {
            var e = event.currentTarget;
            if ((e.scrollTop + e.clientHeight + SCROLL_TRIGGERPOINT > e.scrollHeight) && this.appletOptions.collection.hasNextPage()) {
                event.preventDefault();
                this.appletOptions.collection.setPageSize(this.appletOptions.collection.state.pageSize + SCROLL_ADDITIONAL_ROWS);
                if (this.filterView) {
                    this.filterView.doSearch();
                }
            }
        },
        onSync: function() {
            this._base.onSync.apply(this, arguments);
            if (this.appletOptions.collection instanceof Backbone.PageableCollection) {
                if (this.appletConfig.fullScreen || this.appletConfig.fullScreen === true) {
                    var self = this;
                    var elementToScroll;
                    if (this.$el.find('#grid-panel-' + this.appletConfig.instanceId).length > 0) {
                        elementToScroll = this.$el.find('#grid-panel-' + this.appletConfig.instanceId);
                    } else {
                        elementToScroll = this.$el.find('.data-grid-' + this.appletConfig.instanceId);
                    }
                    elementToScroll.on('scroll', function(event) {
                        self.fetchRows(event);
                    });
                    elementToScroll.trigger("scroll");
                } else {
                    if (this.$el.find('#grid-panel-' + this.appletConfig.instanceId).length > 0) {
                        this.$el.find('#grid-panel-' + this.appletConfig.instanceId).trigger("scroll");
                    } else {
                        this.$el.find('.data-grid-' + this.appletConfig.instanceId).trigger("scroll");
                    }
                }
            }
        },
        refresh: function(event) {
            if (this.appletOptions.refresh !== undefined) {
                this._base.refresh.apply(this, arguments);
            } else {
                var collection = this.appletOptions.collection;
                if (this.appletOptions.collection instanceof Backbone.PageableCollection) {
                    collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {
                        silent: true
                    });
                }
                this._base.refresh.apply(this, arguments);
            }
        },
        dateRangeRefresh: function(filterParameter, options) {
            this.appletOptions.collection.fetchOptions.criteria.filter = this.buildJdsDateFilter(filterParameter, options);

            var collection = this.appletOptions.collection;
            if (this.appletOptions.collection instanceof Backbone.PageableCollection) {
                collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {
                    silent: true
                });
            }
            this.loading();

            this.displayAppletView = DataGrid.create(this.appletOptions);
            collection.reset();
            ResourceService.fetchCollection(collection.fetchOptions, collection);
        },
        expandRowDetails: function(routeParam) {
            if (routeParam) {
                var row = $('#' + routeParam);
                row.click();
                var windowHeight = $(window).height();
                var scrollPosition = row.offset().top;
                if ((scrollPosition + row.next().height() + 50) > windowHeight) {
                    $('html, body').animate({
                        scrollTop: scrollPosition - 100
                    }, 0);
                }
            }
        }
    });

    return GridView;
});