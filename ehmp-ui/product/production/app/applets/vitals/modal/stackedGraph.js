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
    "app/applets/vitals/modal/modalHeaderView",
    'hbs!app/applets/vitals/templates/tooltip'
], function($, InputMask, Backbone, Marionette, _, Highcharts, Util, AppletHelper, dateTemplate, FilterDateRangeView, chartView, observedTemplate, resultTemplate, dateRangeTemplate, modalTemplate, totalTestsTemplate, siteTemplate, detailsFooterTemplate, modalHeader, tooltip) {
    'use strict';

    var sharedDateRange,
        isGraphable;


    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().subtract('years', 2).format(ADK.utils.dateUtils.defaultOptions().placeholder),
            toDate: moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
        }
    });

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

    function Chart(options) {
        return this.init(options);
    }

    Chart.prototype = {
        init: function(options) {
            var self = this;
            this.collection = options.collection;
            this.first = this.collection.first();
            this.chartOptions = $.extend(true, {}, options.chartOptions);
            this.fullCollection = this.collection.fullCollection;

            this.chartOptions.xAxis.type = 'datetime';

            var low = this.fullCollection.pluck('low');
            var high = this.fullCollection.pluck('high');

            if (options.modalDisplayName !== 'BP') {
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
                        return parseFloat(bpSplitData[1]);
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


            var categories = this.fullCollection.pluck('observed');

            categories = _.map(categories, function(num) {
                return moment(ADK.utils.formatDate(num)).valueOf();
            });


            categories.reverse();



            var data = this.fullCollection.pluck('result');
            var units = [];
            units = this.fullCollection.pluck('units');
            var bpDiatolicData = [];
            var bpSystolicData = [];
            var cleanData = [];
            _.each(data, function(e, i) {
                if (options.modalDisplayName !== 'BP') {
                    if (_.isNaN(data[i] * 1)) {
                        cleanData.push(null);
                    } else {
                        if (options.modalDisplayName !== 'HT') {
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
                            bpDiatolicData.push(parseFloat(bpSplitData[1]));
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
            if (options.modalDisplayName !== 'WT' && options.modalDisplayName !== 'HT' && options.modalDisplayName !== 'PN' && options.modalDisplayName !== 'BMI') {
                _.each(cleanData, function(e, i) {
                    var dataNumber = parseFloat(cleanData[i]);

                    if (options.modalDisplayName == 'BP') {
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
            if (options.modalDisplayName !== 'BP') {
                setisGraphable(onlyNumData);
            } else {
                setisGraphable(bpSystolicData);
            }

            this.chartOptions.series[0].data = [];

            if (options.modalDisplayName !== 'BP') {
                _.forEach(data, function(e, i) {
                    var mo = moment(categories[i]);
                    self.chartOptions.series[0].data.push({
                        y: data[i],
                        x: categories[i],
                        dataLabels: {
                            enabled: false
                        }
                    });
                    if (highLow[i]) {
                        highLow[i].unshift(categories[i]);
                    }

                });
            } else {
                _.forEach(bpSystolicData, function(e, i) {
                    self.chartOptions.series[0].data.push({
                        y: bpSystolicData[i],
                        x: categories[i],
                        dataLabels: {
                            enabled: false
                        }
                    });
                    if (highLow[i]) {
                        highLow[i].unshift(categories[i]);
                    }
                });
            }



            // this.chartOptions.xAxis.tickInterval = 1;

            // // Restrict the X-axis size
            // if (this.fullCollection.length > 60) {
            //     this.chartOptions.xAxis.tickInterval = 10;
            // } else if (this.fullCollection.length > 35) {
            //     this.chartOptions.xAxis.tickInterval = 7;
            // } else if (this.fullCollection.length > 10) {
            //     this.chartOptions.xAxis.tickInterval = 5;
            // }

            // this.chartOptions.xAxis.categories = categories;
            // this.chartOptions.series[0].data = data;
            this.chartOptions.series[0].zIndex = 1;
            if (this.first !== undefined) {
                this.chartOptions.yAxis.title.text = this.first.get('units');
            } else {
                this.chartOptions.yAxis.title.text = '';
            }

            if (options.modalDisplayName == 'BP') {
                this.chartOptions.series[0].name = 'SBP';
            } else if (options.modalDisplayName == 'WT') {
                this.chartOptions.series[0].name = 'Weight';
            } else {
                this.chartOptions.series[0].name = options.model.attributes.typeName;
            }

            var graphUnits = [];
            if (options.modalDisplayName !== 'BMI' && this.first !== undefined) {
                graphUnits = this.first.get('units');
            }

            this.chartOptions.tooltip = {
                valueSuffix: ' ' + graphUnits,
                crosshairs: true,
                shared: true,
                style: {
                    padding: 4,
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

            if (options.modalDisplayName == 'BP') {
                this.chartOptions.series[1] = {
                    name: 'DBP',
                    data: [],
                    type: 'line',
                    linkedTo: ':previous',
                    zIndex: 1,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                };



                _.forEach(bpDiatolicData, function(e, i) {
                    self.chartOptions.series[1].data.push({
                        y: bpDiatolicData[i],
                        x: categories[i],
                        dataLabels: {
                            enabled: false
                        }
                    });
                });


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
            // console.log(this.chartOptions.series);
            return this.chartOptions;
        }


    };

    function VitalsStackedGraph(options) {
        this.options = options;
        this.model = options.model;
        this.fetchOptions = {};
        this.init(options);
    }
    VitalsStackedGraph.prototype = {
        init: function() {
            var self = this;

            var dateRange;

            if (sharedDateRange === undefined || sharedDateRange === null) {
                this.resetSharedModalDateRangeOptions();
            }

            this.fetchOptions.resourceTitle = "patient-record-vital";
            var fetchName = this.model.attributes.typeName;
            if (this.model.attributes.typeName.indexOf("Blood") >= 0) fetchName = 'Blood Pressure';
            var typeName = fetchName;
            if (typeName === 'BMI') {
                this.fetchOptions.criteria = {
                    filter: 'in(typeName,["WEIGHT","HEIGHT"])'
                };
            } else {
                this.fetchOptions.criteria = {
                    filter: 'eq(typeName,"' + this.model.attributes.typeName + '")'
                };
            }

            if (this.model.attributes.displayName.indexOf("BP") >= 0) {
                this.modalDisplayName = 'BP';
            } else {
                this.modalDisplayName = this.model.attributes.displayName;
            }

            this.fetchOptions.collectionConfig = {
                collectionParse: self.filterCollection,
                comparator: function(model1, model2) {
                    if (model1.get('observed') > model2.get('observed')) {
                        return -1;
                    } else if (model1.get('observed') < model2.get('observed')) {
                        return 1;
                    }

                    return 0;
                },
                modalDisplayName: self.modalDisplayName
            };

            this.fetchOptions.pageable = true;
            this.fetchOptions.cache = false;

            this.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);

            this.collection.on('sync', function() {
                self.collection = this.collection;
                if (self.collection.length > 0) {
                    self.model.attributes.qualifiedName = self.collection.first().get('qualifiedName');
                    self.model.set('resultUnits', self.collection.first().get('resultUnits'));
                    self.model.set('observed', self.collection.first().get('observed'));
                } else {
                    self.model.set('resultUnits', '--');
                }

                $.extend(true, self, self.model.attributes);

                self.chart = new Chart({
                    chartOptions: $.extend(true, {}, AppletHelper.chartOptions),
                    model: self.model,
                    collection: self.collection,
                    modalDisplayName: self.modalDisplayName
                });

                var tooltipModel = self.createTooltipModel(self.collection);
                if (!$.isEmptyObject(tooltipModel)) {
                    self.tooltip = tooltip(tooltipModel.attributes);
                }

                ADK.Messaging.getChannel('stackedGraph').trigger('readyToChart', {
                    response: self,
                    time: moment()
                });
            }, this);


            //end of init
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
                displayName: this.modalDisplayName
            }));

            newColl.each(function(column) {
                // if (column.attributes.numericDate <= moment(sharedDateRange.attributes.toDate).format("YYYYMMDD") && (column.attributes.numericDate >= moment(sharedDateRange.attributes.fromDate).format("YYYYMMDD") || sharedDateRange.attributes.fromDate === null)) {

                // }

                resultColl.push(column);
            });

            return resultColl;

            //end of filterCollection
        },
        resetSharedModalDateRangeOptions: function() {
            sharedDateRange = new DateRangeModel();
        },
        createTooltipModel: function(collectionItems) {
            if (collectionItems.models.length === 0) {
                return {};
            }

            var tooltipModel = {};
            for (var i = 0; i < collectionItems.models.length && i < 5; i++) {

                if ($.isEmptyObject(tooltipModel)) {
                    _.extend(tooltipModel, collectionItems.models[i]);
                } else {

                    if (tooltipModel.attributes.limitedoldValues === undefined) {
                        tooltipModel.attributes.limitedoldValues = [];
                    }
                    tooltipModel.attributes.limitedoldValues.push(collectionItems.models[i]);
                }
            }

            return tooltipModel;
        }

    };

    return VitalsStackedGraph;

});