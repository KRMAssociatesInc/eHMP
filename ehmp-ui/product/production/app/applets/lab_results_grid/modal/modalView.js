define([
    "jquery",
    "jquery.inputmask",
    "moment",
    "backbone",
    "marionette",
    "underscore",
    "highcharts",
    "highcharts-more",
    "app/applets/lab_results_grid/appletHelpers",
    "hbs!app/applets/lab_results_grid/list/dateTemplate",
    "hbs!app/applets/lab_results_grid/list/resultTemplate",
    "hbs!app/applets/lab_results_grid/list/siteTemplate",
    "hbs!app/applets/lab_results_grid/list/flagTemplate",
    "hbs!app/applets/lab_results_grid/list/referenceRangeTemplate",
    "hbs!app/applets/lab_results_grid/modal/modalTemplate",
    "hbs!app/applets/lab_results_grid/modal/chartView",
    "hbs!app/applets/lab_results_grid/modal/totalTestsTemplate",
    "app/applets/lab_results_grid/modal/filterDateRangeView"
], function($, InputMask, moment, Backbone, Marionette, _, Highcharts, HighchartsMore, AppletHelper, dateTemplate, resultTemplate, siteTemplate,
    flagTemplate, referenceRangeTemplate, modalTemplate, chartView, totalTestsTemplate, FilterDateRangeView) {
    'use strict';

    var currentModel, currentCollection, gridOptions = {},
        columns, mockData2, DataGridView, DataGridCollection, chartOptions, Chart, categories, data, fetchCollection = {},
        low, high,
        TotalTestModel, trsForShowingModal = [],
        modals = [],
        panelModals = [],
        dataCollection,
        no_graph = true;


    DataGridCollection = Backbone.Collection.extend({});

    columns = [{
        name: "observed",
        label: "Date",
        template: dateTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "flag",
        label: "Flag",
        template: flagTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "result",
        label: "Result",
        template: resultTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "facilityMoniker",
        label: "Facility",
        template: siteTemplate,
        cell: "handlebars",
        sortable: false
    }];

    gridOptions.columns = columns;
    gridOptions.appletConfig = {
        name: 'lab_results_modal',
        id: 'lab_results_grid-modalView'
    };

    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: null, // moment().subtract('years', 1).format("YYYY-MM-DD"),
            toDate: null, // moment().add('months', 6).format("YYYY-MM-DD"),
            customFromDate: null,
            customToDate: null,
            selectedId: null // '1yr-range'
                // hasCustomRangeValuesBeenPrepopulated: false
        }
    });

    var dateRange = new DateRangeModel();
    var filterDateRangeView = new FilterDateRangeView({
        model: dateRange
    });

    var sharedDateRange;

    // var sharedDateRange;

    // TODO - May have to make ChartView a composite view for cycling through panel results
    var ChartView = Backbone.Marionette.ItemView.extend({
        template: chartView,
        id: 'chart-container',
        initialize: function(options) {
            var self = this;
            this.collection = options.collection;
            this.first = this.collection.first();
            this.chartOptions = options.chartOptions;
            this.fullCollection = this.collection.fullCollection;

            low = this.fullCollection.map(function(model) {
                if (model.has('low')) {
                    return model.get('low');
                }
                return null;
            });
            high = this.fullCollection.map(function(model) {
                if (model.has('high')) {
                    return model.get('high');
                }
                return null;
            });

            low = _.map(low, function(num) {
                return num === null ? num : num * 1;
            });

            high = _.map(high, function(num) {
                return num === null ? num : num * 1;
            });

            var highLow = [];
            _.each(low, function(e, i) {
                var combined = [];
                combined.push(low[i]);
                combined.push(high[i]);
                highLow.push(combined);
            });


            highLow.reverse();


            categories = this.fullCollection.pluck('observed');


            categories = _.map(categories, function(num) {
                return AppletHelper.getDateForChart(num);
            });


            categories.reverse();

            data = this.fullCollection.pluck('result');

            data = _.map(data, function(num) {
                if (_.isNaN(num * 1)) {
                    return null;
                } else {
                    return num * 1;
                }
            });

            data.reverse();


            var flagTooltip = this.fullCollection.pluck('flagTooltip');
            flagTooltip.reverse();
            var labelClass = this.fullCollection.pluck('labelClass');
            labelClass.reverse();
            var interpretationCode = this.fullCollection.pluck('interpretationCode');
            interpretationCode.reverse();
            var showFlagIcon = this.fullCollection.pluck('showFlagIcon');
            showFlagIcon.reverse();

            this.chartOptions.series[0].data = [];

            _.forEach(flagTooltip, function(e, i) {
                var mo = moment(categories[i]);
                if (e) {
                    var bkColor = labelClass[i];
                    if (bkColor.match('warning')) {
                        bkColor = '#f0ad4e';
                    } else {
                        bkColor = '#d9534f';
                    }
                    self.chartOptions.series[0].data.push({
                        y: data[i],
                        dataLabels: {
                            enabled: true,
                            useHTML: false,
                            backgroundColor: bkColor,
                            borderRadius: 2.25,
                            formatter: function() {
                                // return '<label style="z-index: -1;" class="label ' + labelClass[i] + '" title="' + e + '">' + interpretationCode[i] + '</label>';
                                return interpretationCode[i];
                            },
                            //padding: 2.7,
                            style: {
                                color: '#ffffff',
                                fontSize: "9px",
                                padding: '1.8px 5.4px 2.7px 5.4px'
                            }
                        },
                        x: Date.UTC(mo.year(), mo.month(), mo.date(), mo.hour(), mo.minute())
                    });

                } else {

                    self.chartOptions.series[0].data.push({
                        y: data[i],
                        dataLabels: {
                            enabled: false
                        },
                        x: Date.UTC(mo.year(), mo.month(), mo.date(), mo.hour(), mo.minute())
                    });

                }
                highLow[i].unshift(Date.UTC(mo.year(), mo.month(), mo.date(), mo.hour(), mo.minute()));

            });

            // this.chartOptions.xAxis.tickInterval = 1;

            // if (this.fullCollection.length > 10) {
            //     this.chartOptions.xAxis.tickInterval = 5;
            // }


            // this.chartOptions.xAxis.categories = categories;
            // this.chartOptions.series[0].data = data;
            this.chartOptions.series[0].zIndex = 1;
            this.chartOptions.yAxis.title.text = this.first.get('units');
            // this.chartOptions.yAxis.plotBands = [{
            //     color: '#C1F4C1',
            //     from: this.first.get('low'),
            //     to: this.first.get('high')
            // }];
            this.chartOptions.tooltip = {
                valueSuffix: ' ' + this.first.get('units'),
                crosshairs: true,
                shared: true,
                style: {
                    padding: 10,
                    zIndex: 9999
                },
                useHTML: true,
                /*formatter: function(){
                    console.log(this);
                    return (function(pon){
                        pon.points.forEach(function(e){
                            console.log(e.y);
                        });
                    })(this);
                },*/
                xDateFormat: "%m/%d/%Y %H:%M"
            };

            this.chartOptions.series[1] = {
                name: 'Ref Range',
                data: highLow,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: '#5CB85C',
                fillOpacity: 0.3,
                zIndex: 0,
                showInLegend: false
            };


        },
        onShow: function() {
            var self = this;
            var chartInterval = setInterval(function() {
                if (self.$el.length) {
                    clearInterval(chartInterval);
                    Chart = new Highcharts.Chart(self.chartOptions);
                    $('body').on('mouseover.modalChart', '#data-grid-lab_results_grid-modalView tbody tr', self.highLightChartPoint);
                    $('body').on('mouseout.modalChart', '#data-grid-lab_results_grid-modalView tbody tr', self.highLightChartPoint);
                }

            }, 500);
        },
        onBeforeDestroy: function() {
            $('body').off('.modalChart');
        },
        highLightChartPoint: function(e) {
            switch (e.type) {
                case 'mouseover':
                    Chart.tooltip.shared = false;
                    var $this = $(this),
                        $td3 = $this.find('td:eq(2)'),
                        $td1 = $this.find('td:eq(0)'),
                        result = $td3.text().replace(/[^\d\.-]/g, '') * 1,
                        date = moment(AppletHelper.getDateForChart($this.data('model').get('observed')));
                    date = (Date.UTC(date.year(), date.month(), date.date(), date.hour(), date.minute()));

                    $.each(Chart.series[0].points, function(i, point) {
                        if (point.y === result && point.x === date) {
                            point.onMouseOver();
                            return false;
                        }
                    });
                    break;
                default:
                    Chart.tooltip.shared = true;
                    break;
            }
        }
    });

    var TotalView = Backbone.Marionette.ItemView.extend({
        template: totalTestsTemplate,
        tagName: 'span',
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        }

    });

    TotalTestModel = Backbone.Model.extend({
        defaults: {
            totalTests: 0
        }
    });

    var totalTestModel = new TotalTestModel();


    var ModalView = Backbone.Marionette.LayoutView.extend({

        template: modalTemplate,
        fetchOptions: {},
        initialize: function(options) {
            //this.model.on('sync', this.render, this);
            var self = this;
            this.tableLoadingView = ADK.Views.Loading.create();
            this.chartLoadingView = ADK.Views.Loading.create();
            this.isFromPanel = options.isFromPanel;
            this.isFromNonPanel = options.isFromNonPanel;
            //this.showNavHeader = !!options.navHeader;

            dataCollection = options.gridCollection;
            // this.getModals();

            if (this.showNavHeader) {
                this.model.attributes.navHeader = true;
            }

            // Fetch patientrecord data from RDK
            this.fetchOptions.resourceTitle = "patient-record-labsbytype";

            // console.log("modalView.js", "typeName=" + this.model.attributes.typeName);

            this.fetchOptions.criteria = {
                'type-name': this.model.attributes.typeName, // "Calcium, Serum or Plasma Quantitative",
                pid: this.model.attributes.pid // "10108V420871"
            };

            this.fetchOptions.viewModel = {
                parse: AppletHelper.parseLabResponse
            };

            //this.target = options.target;


            // pid: model.pid,
            // observedFrom: “20130511”,  // yyyymmdd
            // observedFrom: “20140919”   // yyyymmdd
            // typeName: model.typeName,


            this.fetchOptions.pageable = true;
            this.fetchOptions.cache = false;

            this.fetchOptions.onSuccess = function(collection, response) {
                // _super.expandRowDetails(options.routeParam);
                // console.log("modalView.js", "size of collection is " + collection.length);
                self.collection = collection;
                self.$el.find('.labResultsNext, .labResultsPrev').attr('disabled', false);

                var tempCollection = self.collection.fullCollection.pluck('result');


                tempCollection = _.map(tempCollection, function(num) {
                    return _.isNaN(num * 1);
                });

                tempCollection = _.without(tempCollection, false);

                if (self.showNavHeader) {
                    self.model.attributes.navHeader = true;
                }

                // categories = _.map(self.collection.models, function(item) {
                //     return item.attributes.observed;
                // });

                // // Format the dates for display on the chart
                // categories = _.map(categories, function(num) {
                //     return AppletHelper.getDateForChart(num);
                // });

                // // Get the results from the collection
                // data = _.map(self.collection.models, function(item) {
                //     return item.attributes.result * 1;
                // });

                /*if ((tempCollection.length !== self.collection.fullCollection.length)) {
                    self.chart.show(new ChartView({
                        chartOptions: AppletHelper.chartOptions,
                        model: self.model,
                        data: data,
                        collection: self.collection
                    }));
                    no_graph = false;

                } else {
                    no_graph = true;
                }

                if (no_graph) {
                    var table = setInterval(function() {
                        if ($('#lr-data-table-view').length) {

                            clearInterval(table);
                            // $('#lr-data-table-view').removeClass('col-md-5').addClass('col-md-12');
                            // $('#lr-graph').hide();
                        }

                    }, 500);
                }*/

                var table;

                if (self.chart !== undefined && self.chart !== null) {
                    self.chart.reset();
                }

                if (collection.length !== 0 && (tempCollection.length !== self.collection.fullCollection.length)) {
                    table = setInterval(function() {
                        if ($('#lr-data-table-view').length) {

                            clearInterval(table);
                            $('#lr-data-table-view').removeClass('col-md-12').addClass('col-md-5');
                            $('#lr-graph').removeClass('hidden');
                        }

                    }, 500);
                    self.chart.show(new ChartView({
                        chartOptions: AppletHelper.chartOptions,
                        model: self.model,
                        data: data,
                        collection: self.collection
                    }));

                } else {
                    table = setInterval(function() {
                        if ($('#lr-data-table-view').length) {

                            clearInterval(table);
                            $('#lr-data-table-view').removeClass('col-md-5').addClass('col-md-12');
                            $('#lr-graph').addClass('hidden');
                        }

                    }, 500);
                }

                gridOptions.collection = self.collection;
                gridOptions.filterDateRangeEnabled = true;

                currentModel = options.model;
                self.model = options.model;
                currentCollection = options.collection;

                totalTestModel.set({
                    totalTests: gridOptions.collection.fullCollection.length
                });

                self.dataGrid = ADK.Views.DataGrid.create(gridOptions);

                if (self.leftColumn !== undefined && self.leftColumn !== null) {
                    self.leftColumn.reset();
                    self.leftColumn.show(self.dataGrid);
                }

                // self.listenTo(self.collection, 'reset', function(collection) {
                //     AppletHelper.updateChart(Chart, collection);
                // }, self);

                gridOptions.collection = self.collection;
                if (collection.length !== 0) {

                    self.paginatorView = ADK.Views.Paginator.create({
                        collection: gridOptions.collection,
                        windowSize: 4
                    });
                    $('.js-backgrid').append(self.paginatorView.render().el);
                } else {
                    $('#data-grid-lab_results_grid-modalView').find('tbody').append($('<tr class="empty"><td colspan="4">No Records Found</td></tr>'));
                }

            }; // end of onSuccess
        },
        regions: {
            leftColumn: '.js-backgrid',
            chart: '#js-chart',
            totalTests: '#total-tests',
            dateRangeFilter: '#date-range-filter'
        },
        resetSharedModalDateRangeOptions: function() {
            sharedDateRange = new DateRangeModel();
        },
        onRender: function() {
            var dateRange;
            if (sharedDateRange === undefined || sharedDateRange === null) {
                this.resetSharedModalDateRangeOptions();
            }

            if (sharedDateRange !== undefined && sharedDateRange !== null &&
                sharedDateRange.get('selectedId') !== undefined &&
                sharedDateRange.get('selectedId') !== null) {
                dateRange = sharedDateRange.clone();
            } else {
                dateRange = new DateRangeModel();
            }

            dateRange = new DateRangeModel();

            var filterDateRangeView = new FilterDateRangeView({
                model: dateRange,
                parentView: this
            });
            filterDateRangeView.setFetchOptions(this.fetchOptions);
             filterDateRangeView.setSharedDateRange(sharedDateRange);

            this.dateRangeFilter.show(filterDateRangeView);
            this.leftColumn.show(this.tableLoadingView);
            this.chart.show(this.chartLoadingView);

            // this.totalTests.reset();
            this.totalTests.show(new TotalView({
                model: totalTestModel
            }));
        },
        onShow: function() {

        }

    });

    return ModalView;


});
