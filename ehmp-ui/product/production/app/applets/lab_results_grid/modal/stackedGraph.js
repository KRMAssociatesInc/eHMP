define([
    "jquery",
    "moment",
    "backbone",
    "marionette",
    "underscore",
    "app/applets/lab_results_grid/appletHelpers",
    "hbs!app/applets/lab_results_grid/templates/tooltip"
], function($, moment, Backbone, Marionette, _, AppletHelper, tooltip) {
    'use strict';

    var modalDisplayName,
        typeName,
        sharedDateRange,
        low,
        high,
        categories,
        data;

    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().subtract('years', 2).format(ADK.utils.dateUtils.defaultOptions().placeholder),
            toDate: moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
        }
    });

    function Chart(options) {
        return this.init(options);
    }

    Chart.prototype = {
        init: function(options) {
            var self = this;
            this.collection = options.collection;
            this.first = this.collection.first();
            this.chartOptions = options.chartOptions;
            this.fullCollection = this.collection.fullCollection;

            // this.chartOptions.xAxis.type = 'datetime';
            this.chartOptions.xAxis = {
                type: 'datetime',
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickLength: 0,
                lineWidth: 0
            };

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

            var units = [];
            units = this.fullCollection.pluck('units');

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
                            y: -6,
                            padding: 2.5,
                            formatter: function() {
                                return interpretationCode[i];
                            },
                            style: {
                                color: '#ffffff',
                                fontSize: "9px",
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

            this.chartOptions.series[0].zIndex = 1;
            this.chartOptions.yAxis.title.text = this.first !== undefined ? this.first.get('units') : '';
            this.chartOptions.tooltip = {
                valueSuffix: ' ' + (this.first !== undefined ? this.first.get('units') : ''),
                crosshairs: true,
                shared: true,
                style: {
                    padding: 4,
                    zIndex: 9999
                },
                useHTML: true,
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
            // console.log(this.chartOptions.series);
            this.chartOptions.showAxes = false;
            return this.chartOptions;
        }

    };

    function LabsStackedGraph(options) {
        this.options = options;
        this.model = options.model;
        this.fetchOptions = {};
        this.init(options);
    }
    LabsStackedGraph.prototype = {
        init: function() {
            var self = this;

            var dateRange;

            if (sharedDateRange === undefined || sharedDateRange === null) {
                this.resetSharedModalDateRangeOptions();
            }

            this.fetchOptions.resourceTitle = "patient-record-labsbytype";
            var fetchName = this.model.attributes.typeName;
            this.fetchOptions.criteria = {
                'type.name': this.model.attributes.typeName,
                'date.end': moment().format('YYYYMMDD')
            };
            this.fetchOptions.viewModel = {
                parse: AppletHelper.parseLabResponse
            };
            typeName = fetchName;
            modalDisplayName = this.model.attributes.displayName;

            this.fetchOptions.pageable = true;
            this.fetchOptions.cache = false;
            this.fetchOptions.collectionConfig = {
                comparator: function(model1, model2) {
                    if (model1.get('observed') > model2.get('observed')) {
                        return -1;
                    } else if (model1.get('observed') < model2.get('observed')) {
                        return 1;
                    }

                    return 0;
                }
            };

            this.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);

            this.collection.on('sync', function() {
                if (self.collection.length > 0) {
                    self.model.attributes.qualifiedName = self.collection.first().get('qualifiedName');
                    self.model.set('resultUnits', self.collection.first().get('result') + ' ' + self.collection.first().get('units'));
                    self.model.set('observed', self.collection.first().get('observed'));
                } else {
                    self.model.set('resultUnits', '--');
                }

                $.extend(true, self, self.model.attributes);

                self.chart = new Chart({
                    chartOptions: $.extend(true, {}, AppletHelper.chartOptions),
                    model: self.model,
                    collection: self.collection
                });

                var tooltipModel = self.createTooltipModel(self.collection);
                if (!$.isEmptyObject(tooltipModel)) {
                    self.tooltip = tooltip(tooltipModel.attributes);
                }

                ADK.Messaging.getChannel('stackedGraph').trigger('readyToChart', {
                    response: self
                });

            }, this);

        },

        resetSharedModalDateRangeOptions: function() {
            sharedDateRange = new DateRangeModel();
        },

        createTooltipModel: function(collectionItems) {
            if (collectionItems.models.length === 0) {
                return {};
            }

            var tooltipModel = {};

            var count = 0;
            for (var i = 0; i < collectionItems.models.length && count < 5; i++) {
                if (collectionItems.models[i].attributes.kind !== undefined && collectionItems.models[i].attributes.kind === 'Laboratory') {
                    count = count + 1;
                    collectionItems.models[i].attributes.observedFormatted = AppletHelper.getObservedFormatted(collectionItems.models[i].attributes.observed);
                    if ($.isEmptyObject(tooltipModel)) {
                        _.extend(tooltipModel, collectionItems.models[i]);
                    } else {

                        if (tooltipModel.attributes.limitedoldValues === undefined) {
                            tooltipModel.attributes.limitedoldValues = [];
                        }
                        tooltipModel.attributes.limitedoldValues.push(collectionItems.models[i]);
                    }
                }
            }

            return tooltipModel;
        }
    };

    return LabsStackedGraph;

});