define([
    "jquery",
    "jquery.inputmask",
    "backbone",
    "marionette",
    "underscore",
    "highcharts",
    'app/applets/vitals/util',
    "app/applets/vitals/appletHelpers",
    "hbs!app/applets/vitals/list/dateTemplate",
    "app/applets/vitals/modal/filterDateRangeView",
    "hbs!app/applets/vitals/modal/chartView",
    "hbs!app/applets/vitals/list/observedTemplate",
    'hbs!app/applets/vitals/list/resultTemplate',
    "hbs!app/applets/vitals/modal/dateRangeTemplate",
    "hbs!app/applets/vitals/modal/modalTemplate",
    "hbs!app/applets/vitals/modal/totalTestsTemplate",
    'hbs!app/applets/vitals/list/siteTemplate',
    'hbs!app/applets/vitals/modal/detailsFooterTemplate',
    "app/applets/vitals/modal/modalHeaderView"
], function($, InputMask, Backbone, Marionette, _, Highcharts, Util, AppletHelper, dateTemplate, FilterDateRangeView, chartView, observedTemplate, resultTemplate, dateRangeTemplate, modalTemplate, totalTestsTemplate, siteTemplate, detailsFooterTemplate, modalHeader) {
    'use strict';

    var currentModel, currentCollection, gridOptions = {},
        columns, mockData2, DataGridView, DataGridCollection, chartOptions, Chart, categories, data, fetchCollection = {},
        low, high;
    var TotalTestModel;
    var trsForShowingModal = [],
        modals = [],
        panelModals = [],
        modalDisplayName, isGraphable, typeName,
        dataCollection;

    DataGridCollection = Backbone.Collection.extend({});

    columns = [{
        name: "observed",
        label: "Date",
        template: dateTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "resultUnitsMetricResultUnits",
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
        name: 'vitals_modal',
        id: 'vitals-modalView'
    };

    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().subtract('years', 2).format(ADK.utils.dateUtils.defaultOptions().placeholder),
            toDate: moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
        }
    });

    var dateRange = new DateRangeModel();
    var filterDateRangeView = new FilterDateRangeView({
        model: dateRange
    });

    var sharedDateRange;

    function parseModel(response) {
        response = Util.getObservedFormatted(response);
        // response = Util.getObservedTimeFormatted(response);
        response = Util.getFacilityColor(response);
        // response = Util.getStandardizedName(response);
        response = Util.getResultedFormatted(response);
        // response = Util.getResultedTimeFormatted(response);
        response = Util.getDisplayName(response);
        response = Util.getTypeName(response);
        response = Util.getNumericDate(response);
        response = Util.getResultUnits(response);
        response = Util.getMetricResultUnits(response);
        response = Util.getResultUnitsMetricResultUnits(response);
        response = Util.getReferenceRange(response);
        response = Util.getFormattedHeight(response);
        response = Util.getFormattedWeight(response);
        return response;
    }

    function setisGraphable(e) {
        if (e.length > 0) {
            isGraphable = true;
        } else {
            isGraphable = false;
        }
    }

    function getisGraphable(e) {
        return isGraphable;
    }

    var ChartView = Backbone.Marionette.ItemView.extend({
        template: chartView,
        id: 'chart-container',
        initialize: function(options) {
            var self = this;
            this.collection = options.collection;
            this.first = this.collection.first();
            this.chartOptions = $.extend(true, {}, options.chartOptions);
            this.fullCollection = this.collection.fullCollection;

            low = this.fullCollection.pluck('low');
            high = this.fullCollection.pluck('high');

            if (modalDisplayName !== 'BP') {
                low = _.map(low, function(num) {
                    return parseFloat(num);
                });

                high = _.map(high, function(num) {
                    return parseFloat(num);
                });
            } else {
                var bpSplitData;
                low = _.map(low, function(num) {
                    if (num !== undefined && num !== null) {
                        bpSplitData = num.split("/");
                        return parseFloat(bpSplitData[bpSplitData.length-1]);
                    } else {
                        return undefined;
                    }
                });

                high = _.map(high, function(num) {
                    if (num !== undefined && num !== null) {
                        bpSplitData = num.split("/");
                        return parseFloat(bpSplitData[0]);
                    } else {
                        return undefined;
                    }
                });
            }


            categories = this.fullCollection.pluck('observed');

            categories = _.map(categories, function(num) {
                return AppletHelper.getDateForChart(num);
            });

            categories.reverse();

            data = this.fullCollection.pluck('result');
            var units = [];
            units = this.fullCollection.pluck('units');
            var bpDiatolicData = [];
            var bpSystolicData = [];
            var cleanData = [];
            _.each(data, function(e, i) {
                if (modalDisplayName !== 'BP') {
                    if (_.isNaN(data[i] * 1)) {
                        cleanData.push(null);
                    } else {
                        if (modalDisplayName !== 'HT') {
                            cleanData.push(data[i] * 1);
                        } else {
                            if (units[i] !== 'in' && units[i] !== 'inches') {
                                cleanData.push(Math.floor(data[i] * 0.4));
                            } else {
                                cleanData.push(data[i] * 1);
                            }
                        }
                    }
                } else {
                    var bpSplitData;
                    if (data[i] !== undefined) {
                        if (_.isNaN(data[i] * 1) && data[i].indexOf('/') === -1) {
                            //Currently does not display TextOnly data
                            bpDiatolicData.push(null);
                            bpSystolicData.push(null);
                            cleanData.push(null);
                        } else {
                            bpSplitData = data[i].split('/');
                            bpDiatolicData.push(parseFloat(bpSplitData[bpSplitData.length-1]));
                            bpSystolicData.push(parseFloat(bpSplitData[0]));
                            cleanData.push(parseFloat(bpSplitData[0]));
                        }
                    } else {
                        bpDiatolicData.push(null);
                        bpSystolicData.push(null);
                        cleanData.push(null);
                    }
                }
            });

            var highLow = [];

            //Parsing out bad data
            if (modalDisplayName !== 'WT' && modalDisplayName !== 'HT' && modalDisplayName !== 'PN' && modalDisplayName !== 'BMI') {
                _.each(cleanData, function(e, i) {
                    var dataNumber = parseFloat(cleanData[i]);

                    if (modalDisplayName == 'BP') {
                        var bpDataNumber = parseFloat(bpDiatolicData[i]);
                        if (bpDataNumber !== undefined && !isNaN(bpDataNumber) &&
                            dataNumber !== undefined && !isNaN(dataNumber)) {
                            if (low[i] !== undefined && high[i] !== undefined && !isNaN(low[i]) && !isNaN(high[i])) {
                                highLow.push([low[i], high[i]]);
                            } else {
                                highLow.push([null, null]);
                            }
                        } else {
                            highLow.push([null, null]);
                        }
                    } else {
                        if (dataNumber !== undefined && !isNaN(dataNumber)) {
                            if (low[i] !== undefined && high[i] !== undefined && !isNaN(low[i]) && !isNaN(high[i])) {
                                highLow.push([low[i], high[i]]);
                            } else {
                                highLow.push([null, null]);
                            }
                        }
                    }
                });
            }

            //Reverse the graph so that the x and y line up
            bpSystolicData.reverse();
            bpDiatolicData.reverse();
            data = cleanData;
            data.reverse();
            highLow.reverse();
            var onlyNumData = [];
            //Checks the count of data that is chartable
            _.each(cleanData, function(e, i) {
                var dataNumber = parseFloat(cleanData[i]);
                if (dataNumber !== undefined && !isNaN(dataNumber) && dataNumber !== null) {
                    onlyNumData.push(dataNumber);
                }
            });
            //If there is chartable data show the chart
            if (modalDisplayName !== 'BP') {
                setisGraphable(onlyNumData);
            } else {
                setisGraphable(bpSystolicData);
            }

            this.chartOptions.series[0].data = [];

            if (modalDisplayName !== 'BP') {
                _.forEach(data, function(e, i) {
                    var mo = moment(categories[i]);
                    self.chartOptions.series[0].data.push({
                        y: data[i],
                        dataLabels: {
                            enabled: false
                        }
                    });
                });
            } else {
                _.forEach(bpSystolicData, function(e, i) {
                    self.chartOptions.series[0].data.push({
                        y: bpSystolicData[i],
                        dataLabels: {
                            enabled: false
                        }
                    });
                });
            }

            this.chartOptions.xAxis.tickInterval = 1;

            // Restrict the X-axis size
            if (this.fullCollection.length > 60) {
                this.chartOptions.xAxis.tickInterval = 10;
            } else if (this.fullCollection.length > 35) {
                this.chartOptions.xAxis.tickInterval = 7;
            } else if (this.fullCollection.length > 10) {
                this.chartOptions.xAxis.tickInterval = 5;
            }

            this.chartOptions.xAxis.categories = categories;
            // this.chartOptions.series[0].data = data;
            this.chartOptions.series[0].zIndex = 1;
            this.chartOptions.yAxis.title.text = this.first.get('units');
            if (modalDisplayName == 'BP') {
                this.chartOptions.series[0].name = 'SBP';
            } else if (modalDisplayName == 'WT') {
                this.chartOptions.series[0].name = 'Weight';
            } else {
                this.chartOptions.series[0].name = typeName;
            }

            var graphUnits = [];
            if (modalDisplayName !== 'BMI') {
                graphUnits = this.first.get('units');
            }

            this.chartOptions.tooltip = {
                valueSuffix: ' ' + graphUnits,
                crosshairs: true,
                shared: true,
                style: {
                    padding: 10,
                    zIndex: 9999
                },
                useHTML: true
            };

            if (this.chartOptions.series[2]) {
                this.chartOptions.series[2].data = [];
            }

            if (this.chartOptions.series[1]) {
                this.chartOptions.series[1].data = [];
            }

            if (modalDisplayName == 'BP') {
                this.chartOptions.series[1] = {
                    name: 'DBP',
                    data: bpDiatolicData,
                    type: 'line',
                    linkedTo: ':previous',
                    zIndex: 1,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                };

                this.chartOptions.series[2] = {
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
            } else if (highLow.length > 0) {
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
            }



        },
        onShow: function() {
            var self = this;
            var chartInterval = setInterval(function() {
                if (self.$el.length) {
                    clearInterval(chartInterval);
                    Chart = new Highcharts.Chart(self.chartOptions);
                    $('#lr-data-table-view').on('mouseover', '#data-grid-vitals-modalView tbody tr', self.highLightChartPoint);
                    $('#lr-data-table-view').on('mouseout', '#data-grid-vitals-modalView tbody tr', self.highLightChartPoint);
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
                        $td3 = $this.find('td:eq(1)'),
                        $td1 = $this.find('td:eq(0)');
                    if (modalDisplayName !== 'BP') {
                        var result = $td3.text().replace(/[^\d\.-]/g, '') * 1,
                            date = moment($td1.text()).format("MMM DD YYYY");
                        $.each(Chart.series[0].points, function(i, point) {
                            if (point.y === result && point.category === date) {
                                point.onMouseOver();
                                return false;
                            }
                        });
                    } else {
                        var splitData = $td3.text().split('/'),
                            bpResult = splitData[0].replace(/[^\d\.-]/g, '') * 1,
                            bpDate = moment($td1.text()).format("MMM DD YYYY");
                        $.each(Chart.series[0].points, function(i, point) {
                            if (point.y === bpResult && point.category === bpDate) {
                                point.onMouseOver();
                                return false;
                            }
                        });
                    }
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
            // Fetch patientrecord data from RDK

            this.loadingView = ADK.Views.Loading.create();
            this.loadingView2 = ADK.Views.Loading.create();
            dataCollection = options.gridCollection;
            this.getModals();

            if (this.showNavHeader) {
                this.model.attributes.navHeader = true;
            }

            if (this.showNavHeader) {
                this.model.attributes.navHeader = true;
            }

            this.fetchOptions.resourceTitle = "patient-record-vital";
            var fetchName = this.model.attributes.typeName;
            if (this.model.attributes.typeName.indexOf("Blood") >= 0) fetchName = 'Blood Pressure';
            this.fetchOptions.criteria = {
                typeName: fetchName, // "Calcium, Serum or Plasma Quantitative",
                pid: this.model.attributes.pid, // "10108V420871"
                // observedFrom: moment().subtract('years', 1).format("YYYYMMDD"),
                // observedTo: moment().format("YYYYMMDD")
                filter: 'ne(result,Pass)'
            };

            typeName = fetchName;
            if (this.model.attributes.displayName.indexOf("BP") >= 0) {
                modalDisplayName = 'BP';
            } else {
                modalDisplayName = this.model.attributes.displayName;
            }
            // this.target = options.target;



            var self = this;

            this.fetchOptions.collectionConfig = {
                collectionParse: self.filterCollection
            };

            this.fetchOptions.pageable = true;
            // this.fetchOptions.cache = true;

            this.fetchOptions.onSuccess = function(collection, response) {
                // _super.expandRowDetails(options.routeParam);
                self.collection = collection;
                self.$el.find('.vitalsNext, .vitalsPrev').attr('disabled', false);

                var tempCollection = self.collection.fullCollection.pluck('result');

                if (self.showNavHeader) {
                    self.model.attributes.navHeader = true;
                }

                tempCollection = _.map(tempCollection, function(num) {
                    return _.isNaN(num * 1);
                });

                tempCollection = _.without(tempCollection, false);

                if (self.showNavHeader) {
                    self.model.attributes.navHeader = true;
                }

                var table;

                if (self.chart !== undefined && self.chart !== null) {
                    self.chart.reset();
                }

                if (collection.length !== 0) {
                    var vitalsChart = new ChartView({
                        chartOptions: $.extend(true, {}, AppletHelper.chartOptions),
                        model: self.model,
                        data: data,
                        collection: self.collection
                    });
                    if (getisGraphable()) {
                        table = setInterval(function() {
                            if ($('#lr-data-table-view').length) {

                                clearInterval(table);
                                $('#lr-data-table-view').removeClass('col-md-12').addClass('col-md-5');
                                $('#lr-graph').removeClass('hidden');
                            }

                        }, 500);
                        self.chart.show(vitalsChart);

                    } else {
                        table = setInterval(function() {
                            if ($('#lr-data-table-view').length) {
                                clearInterval(table);
                                $('#lr-data-table-view').removeClass('col-md-5').addClass('col-md-12');
                                $('#lr-graph').addClass('hidden');
                            }

                        }, 500);
                    }

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

                // console.log("gridOptions.collection", gridOptions.collection);

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
                    //this should just be set on gridOptions.emptyText and shouldn't 
                    //need to do any DOM manipulation for this
                    $('#data-grid-vitals-modalView').find('tbody').append($('<tr class="empty"><td colspan="4">No Records Found</td></tr>'));
                }
            }; // end of onSuccess

        },
        events: {
            'click .vitalsNext': 'getNextModal',
            'click .vitalsPrev': 'getPrevModal'
        },
        getNextModal: function(e) {
            var next = _.indexOf(modals, this.model) + 1;
            if (next >= modals.length) {
                // dataCollection.getFirstPage();
                // this.getModals();
                next = 0;
            }
            var model = modals[next];
            this.setNextPrevModal(model);
        },
        getPrevModal: function(e) {
            var next = _.indexOf(modals, this.model) - 1;
            if (next < 0) {
                // dataCollection.getLastPage();
                // this.getModals();
                next = modals.length - 1;
            }
            var model = modals[next];

            this.setNextPrevModal(model);
        },
        setNextPrevModal: function(model) {

            if (this.showNavHeader) {
                model.attributes.navHeader = true;
            }
            if (model.get('inAPanel')) {
                var tr = $('#data-grid-vitals > tbody>tr.selectable').eq(model.get('parentIndex'));
                if (!tr.data('isOpen')) {
                    tr.trigger('click');
                }
                $('#data-grid-vitals > tbody>tr.selectable').not(tr).each(function() {
                    var $this = $(this);
                    if ($this.data('isOpen')) {
                        $this.trigger('click');
                    }

                });

            }

            var view = new ModalView({
                model: model,
                gridCollection: dataCollection,
                navHeader: this.showNavHeader
            });
            var modalOptions = {
                'title': model.get('typeName'),
                'size': 'xlarge',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view
                }),
                'footerView': Backbone.Marionette.ItemView.extend({
                    template: detailsFooterTemplate,
                    events: {
                        'click #error': 'enteredInError'
                    },
                    enteredInError: function(event) {
                        var vitalEnteredInErrorChannel = ADK.Messaging.getChannel('vitalsEiE');
                        vitalEnteredInErrorChannel.trigger('vitalsEiE:clicked', event, {
                            'collection': dataCollection.models,
                            'title': model.attributes.observedFormatted,
                            'checked': model.attributes.localId
                        });
                    }
                }),
                'regionName': 'vitalsDetailsDialog',
                'replaceContents': true
            };

            ADK.showWorkflowItem(view, modalOptions);
        },
        getModals: function() {
            modals = [];
            panelModals = [];
            if (dataCollection !== undefined) {
                _.each(dataCollection.models, function(m, key) {

                    if (m.get('vitals')) {
                        var outterIndex = dataCollection.indexOf(m);
                        // console.log('>>>>>outterIndex', outterIndex);
                        _.each(m.get('vitals').models, function(m2, key) {
                            m2.set({
                                'inAPanel': true,
                                'parentIndex': outterIndex,
                                'parentModel': m
                            });
                            modals.push(m2);

                        });
                    } else {
                        modals.push(m);
                    }


                });
            }
            //console.log(modals);
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
                sharedDateRange.get('preSelectedDateRange') !== undefined &&
                sharedDateRange.get('preSelectedDateRange') !== null) {
                dateRange = sharedDateRange.clone();
            } else {
                dateRange = new DateRangeModel();
            }

            new DateRangeModel();
            var filterDateRangeView = new FilterDateRangeView({
                model: dateRange,
                parentView: this
            });
            filterDateRangeView.setFetchOptions(this.fetchOptions);
            filterDateRangeView.setSharedDateRange(sharedDateRange);

            this.dateRangeFilter.show(filterDateRangeView);

            this.leftColumn.show(this.loadingView);
            if (getisGraphable()) {
                this.chart.show(this.loadingView2);
            }

            this.totalTests.show(new TotalView({
                model: totalTestModel
            }));

            self.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);
        },
        filterCollection: function(coll) {
            coll.models.forEach(function(model) {
                model.attributes = parseModel(model.attributes);
            });

            var resultColl = [];
            var allTypes = $.unique(coll.pluck('displayName'));
            var knownTypes = ['BP', 'P', 'R', 'T', 'PO2', 'PN', 'WT', 'HT', 'BMI'];
            var displayTypes = knownTypes.filter(function(el) {
                return allTypes.indexOf(el) != -1;
            });

            var newColl = new Backbone.Collection(coll.where({
                displayName: modalDisplayName
            }));

            newColl.each(function(column) {
                if (column.attributes.numericDate <= moment(sharedDateRange.attributes.toDate).format("YYYYMMDD") && (column.attributes.numericDate >= moment(sharedDateRange.attributes.fromDate).format("YYYYMMDD") || sharedDateRange.attributes.fromDate === null)) {
                    resultColl.push(column);
                }
            });

            if (modalDisplayName === 'BMI') {
                resultColl = _.sortBy(resultColl, function(bmi) {
                    return -bmi.get('observed');
                });
            }
            return resultColl;
        }
    });

    return ModalView;

});