define([
    'jquery',
    'underscore',
    'main/Utils',
    'main/backgrid/filter',
    'api/ResourceService',
    'api/SessionStorage',
    'main/components/views/loadingView',
    'main/components/views/errorView',
    'main/components/applets/baseDisplayApplet/views/filterDateRangeView',
    'hbs!main/components/applets/baseDisplayApplet/templates/containerTemplate'
], function($, _, utils, CollectionFilter, ResourceService, SessionStorage, LoadingView, ErrorView, FilterDateRangeView, containerTemplate) {
    'use strict';

    // this.
    //      appletConfig    : {id, instanceId, fullscreen}
    //      appletOptions
    //      routeParam
    //      toolbarView

    // this.appletOptions = {
    //      AppletView              : view to show
    //      filterFields
    //      filterDateRangeField
    //      appletConfig            : {id, instanceId, fullscreen}
    //      collection
    //      refresh                 : method (optional overwrite)
    //      onClickAdd              : method
    // }

    // this.model
    //      instanceId

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        initialize: function(options) {
            if ((!this.appletConfig) || _.isUndefined(this.appletConfig.instanceId)) {
                if (this.options.appletConfig && _.isUndefined(this.options.appletConfig.instanceId)) {
                    this.options.appletConfig.instanceId = this.options.appletConfig.id;
                } else if (!this.options.appletConfig) {
                    this.options.appletConfig = {};
                    this.options.appletConfig.id = this.appletOptions.appletConfig.id;
                    this.options.appletConfig.instanceId = this.appletOptions.appletConfig.instanceId;
                    this.options.appletConfig.fullScreen = false;
                }
                this.appletConfig = this.options.appletConfig;
            }

            var appletOptions = this.appletOptions || {}; //Set in extending view
            this.appletOptions = appletOptions;

            this.appletOptions.emptyText = appletOptions.emptyText || 'No Records Found';
            this.listenTo(this.appletOptions.collection, 'sync', this.onSync);
            this.listenTo(this.appletOptions.collection, 'error', this.onError);

            this.routeParam = this.options.routeParam;

            //Set applet's fullScreen option in session
            if (this.appletConfig.fullScreen) {
                SessionStorage.setAppletStorageModel(this.appletConfig.instanceId, 'fullScreen', true);
            } else {
                SessionStorage.setAppletStorageModel(this.appletConfig.instanceId, 'fullScreen', false);
            }

            // Used for template
            this.model = new Backbone.Model({
                instanceId: this.appletConfig.instanceId
            });

            //Create Filter and Filter Button View
            if (this.appletOptions.filterFields || this.appletOptions.filterDateRangeField) {
                var filterFields, filterDateRangeField, dateRangeEnabled = false;
                if (this.appletOptions.filterFields) {
                    filterFields = this.appletOptions.filterFields;
                }
                if (this.appletOptions.filterDateRangeField) {
                    filterDateRangeField = this.appletOptions.filterDateRangeField;
                    dateRangeEnabled = true;
                }

                var filterOptions = {
                    id: this.appletConfig.instanceId,
                    collection: this.appletOptions.collection,
                    filterFields: filterFields,
                    filterDateRangeField: filterDateRangeField
                };

                this.filterView = CollectionFilter.create(filterOptions);

                this.appletOptions.appletId = this.appletConfig.id;
                this.appletOptions.instanceId = this.appletConfig.instanceId;
                if (this.appletOptions.filterDateRangeField && this.appletConfig.fullScreen) {
                    this.filterDateRangeView = new FilterDateRangeView({
                        model: new Backbone.Model(appletOptions),
                        appletId: this.appletOptions.appletId,
                        appletView: this
                    });
                }
            }

            if (this.appletOptions.hasOwnProperty('onClickAdd')) {
                this.onClickAdd = this.appletOptions.onClickAdd;
            }

            if (this.appletOptions.toolbarView) {
                this.toolbarView = this.appletOptions.toolbarView;
            }

            //Create Data Grid View
            this.setAppletView();

            //Create Loading View
            this.loadingView = LoadingView.create();
        },
        setAppletView: function() {
            this.displayAppletView = new this.appletOptions.AppletView(this.appletOptions);
        },
        onRender: function() {
            window.scrollTo(0, 0);
            this.loading();
            if (this.filterView) {
                $(this.filterView.el).css({
                    marginLeft: '0px',
                    marginTop: '0px',
                    marginBottom: '6px'
                });

                this.appletFilter.show(this.filterView);
                var queryInputSelector = 'input[name=\'q-' + this.appletConfig.instanceId + '\']';
                var self = this;

                this.filterView.$el.find('input[type=search]').on('change', function() {
                    SessionStorage.setAppletStorageModel(self.appletConfig.instanceId, 'filterText', $(this).val());
                    SessionStorage.setAppletStorageModel(self.appletConfig.id, 'filterText', $(this).val());
                });
                this.filterView.$el.find('a[data-backgrid-action=clear]').on('click', function() {
                    SessionStorage.setAppletStorageModel(self.appletConfig.instanceId, 'filterText', $(this).val());
                    SessionStorage.setAppletStorageModel(self.appletConfig.id, 'filterText', $(this).val());
                });

                if (this.filterDateRangeView) {
                    this.appletFilterDateRange.show(this.filterDateRangeView);
                }

                this.$el.find('.grid-filter input').attr('tabindex', '0');
            }
        },
        template: containerTemplate,
        regions: {
            appletContainer: '.grid-container',
            appletToolbar: '.grid-toolbar',
            appletFilterDateRange: '.grid-filter-daterange',
            appletFilter: '.grid-filter'
        },
        eventMapper: {
            'refresh': 'refresh',
            'add': 'onClickAdd'
        },
        onSync: function(collection) {
            $("[data-instanceid='" + this.appletConfig.instanceId + "']").find('.fa-refresh').removeClass('fa-spin');
            if (this.toolbarView) {
                this.appletToolbar.show(this.toolbarView);
            }

            if (this.filterView) {
                var searchText = SessionStorage.getAppletStorageModel(this.appletConfig.instanceId, 'filterText');
                if (searchText !== undefined && searchText !== null && searchText.trim().length > 0) {
                    this.filterView.search();
                }
            }
            this.showStandardAppletView();

            if (this.appletOptions.collection.length > 0 && !_.isUndefined(this.appletOptions.tblRowSelector)) {
                $(this.appletOptions.tblRowSelector).each(function() {
                    $(this).attr("data-infobutton", $(this).find('td:nth-child(2)').text().replace('Panel', ''));
                });
            }

            var applet = $("[data-instanceid='" + this.appletConfig.instanceId + "']");
            var el, i;

            _.each(this.appletOptions.columns, function(column, index) {
                i = index + 1;
                el = $(applet).find('thead th:nth-child(' + i + ') a');
                if (el.length === 0)
                    el = $(applet).find('thead th:nth-child(' + i + ')');
                $(el).attr('tooltip-data-key', column.hoverTip);
            });
        },
        onError: function(collection, resp) {
            var errorModel = new Backbone.Model(resp);
            var errorView = ErrorView.create({
                model: errorModel
            });
            this.appletContainer.show(errorView, {
                preventDestroy: true
            });
        },
        loading: function() {
            this.appletContainer.show(this.loadingView, {
                preventDestroy: true
            });
        },
        showStandardAppletView: function() {
            this.appletContainer.show(this.displayAppletView, {
                preventDestroy: true
            });
        },
        refresh: function(event) {
            if (this.appletOptions.refresh !== undefined) {
                this.loading();
                this.appletOptions.refresh(this);
                return;
            }
            var collection = this.appletOptions.collection;

            this.loading();
            this.setAppletView();

            if (collection instanceof Backbone.PageableCollection) {
                collection.fullCollection.reset();
            } else {
                collection.reset();
            }

            ResourceService.clearCache(collection.url);
            ResourceService.fetchCollection(collection.fetchOptions, collection);
        },
        buildJdsDateFilter: function(dateField, options) {
            var isOverrideGlobalDate, fromDate, toDate, customFilter, operator;

            options = options || {};
            _.defaults(options, {
                isOverrideGlobalDate: false,
                operator: 'and'
            }); // by default use global date
            isOverrideGlobalDate = options.isOverrideGlobalDate;
            customFilter = options.customFilter;
            operator = options.operator;

            if (isOverrideGlobalDate) {
                fromDate = options.fromDate;
                toDate = options.toDate;
            } else {
                var globalDate = SessionStorage.getModel('globalDate');
                if (globalDate.get('selectedId') !== undefined && globalDate.get('selectedId') !== null) {
                    fromDate = globalDate.get('fromDate');
                    toDate = globalDate.get('toDate');
                }
            }

            if (fromDate === undefined || fromDate === null || fromDate.trim().length === 0) {
                fromDate = '';
            } else {
                fromDate = '"' + utils.formatDate(fromDate, 'YYYYMMDD', 'MM/DD/YYYY') + '"';
            }

            if (toDate === undefined || toDate === null || toDate.trim().length === 0) {
                toDate = '';
            } else {
                toDate = '"' + utils.formatDate(toDate, 'YYYYMMDD', 'MM/DD/YYYY') + '235959"';
            }

            var dateFilter;

            if (fromDate !== '' && toDate !== '') {
                dateFilter = 'between(' + dateField + ',' + fromDate + ',' + toDate + ')';
            } else if (fromDate === '' && toDate !== '') {
                dateFilter = 'lte(' + dateField + ',' + toDate + ')';
            } else if (fromDate !== '' && toDate === '') {
                dateFilter = 'gte(' + dateField + ',' + fromDate + ')';
            } else {
                console.error('BaseDisplayAppletView: buildJdsDateFilter both fromDate and toDate are empty.');
            }

            if (customFilter !== undefined && customFilter !== null) {
                dateFilter = operator + '(' + dateFilter + ',' + customFilter + ')';
            }

            return dateFilter;
        },
        dateRangeRefresh: function(filterParameter, options) {
            this.appletOptions.collection.fetchOptions.criteria.filter =
                this.buildJdsDateFilter(filterParameter, options);

            var collection = this.appletOptions.collection;
            this.loading();
            this.displayAppletView = new this.appletOptions.AppletView(this.appletOptions);

            if (collection instanceof Backbone.PageableCollection) {
                collection.fullCollection.reset();
            } else {
                collection.reset();
            }

            ResourceService.fetchCollection(collection.fetchOptions, collection);
        },
        showFilterView: function() {
            var filterText = SessionStorage.getAppletStorageModel(this.appletConfig.instanceId, 'filterText');
            if (_.isUndefined(filterText) || _.isNull(filterText)) {
                filterText = SessionStorage.getAppletStorageModel(this.appletConfig.id, 'filterText');
            }
            if (this.appletOptions.filterFields && filterText !== undefined && filterText !== null && filterText.length > 0) {
                this.$el.find('#grid-filter-' + this.appletConfig.instanceId).toggleClass('collapse in');
                this.$el.find('input[name=\'q-' + this.appletConfig.instanceId + '\']').val(filterText);
                this.filterView.showClearButtonMaybe();
            } else if (this.appletOptions.filterDateRangeField && this.appletConfig.fullScreen) {
                this.$el.find('#grid-filter-' + this.appletConfig.instanceId).toggleClass('collapse in');
            }
        },
        onShow: function() {
            this.showFilterView();
        },
        onBeforeDestroy: function() {
            if (this.toolbarView) {
                this.toolbarView.destroy();
                this.toolbarView = null;
            }
        }
    });

    return AppletLayoutView;
});