var MR_Hchart;
define([
    "backbone",
    "marionette",
    "underscore",
    "moment",
    "highcharts",
    "app/applets/medication_review/medicationCollectionHandler",
    "hbs!app/applets/medication_review/charts/graphTemplate",
    "app/applets/medication_review/charts/chartHelper"
], function(Backbone, Marionette, _, moment, Highcharts, graphDataHandler, graphTemplate, ChartHelper) {

    var OutpatientItemView = Backbone.Marionette.ItemView.extend({
        template: graphTemplate,
        opChart: null,
        events: {
            'click .mr_reset': 'mr_buttonReset',
        },
        initialize: function() {
            this.model = new Backbone.Model();
            var self = this;
            ADK.Messaging.getChannel('medication_review').on('chartData_ready', function() {
                self.model.clear();
                self.model.set(graphDataHandler.allGraphMedications.models);
            });
        },
        getTemplate: function() {
            if (graphDataHandler.allGraphMedications.models.length <= 0) {
                return _.template('<div id="medicationsAccordion" class="panel-group"><span class="col-layout-md"><strong>No Records </strong></span><div id="graphContainer" class="hidden"></div><div>');
            } else {
                return graphTemplate;
            }
        },
        mr_buttonReset: function() {
            MR_Hchart.xAxis[0].setExtremes(null, null);
            MR_Hchart.yAxis[0].setExtremes(null, null);
            MR_Hchart.setSize(MR_Hchart.originalSize.width,
                MR_Hchart.originalSize.height, false);
            MR_Hchart.zoomMode = false;
            $(".mr_reset").hide();
        },
        onRender: function() {
            if (!($.isEmptyObject(this.model.attributes))) {
                this.showChart();
                $(".mr_reset").hide();
            }
        },
        onBeforeDestroy: function() {
            ADK.Messaging.getChannel('medication_review').off('chartData_ready');
        },
        modelEvents: {
            'change': 'render'
        },
        toTitleCase: function(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        showChart: function() {
            var medis = this.model.attributes;
            var series = [];
            var oArray = [];
            var iArray = [];
            var nArray = [];

            for (var i = 0; i < graphDataHandler.allGraphMedications.models.length; i++) {
                var meds = medis[i];
                var mec = meds.attributes.meds.models;
                var category;

                if (meds.attributes.subcategory !== undefined) {
                    this.category = this.toTitleCase(meds.attributes.name) + ' - ' + meds.attributes.subcategory;
                } else {
                    this.category = this.toTitleCase(meds.attributes.name);
                }

                series[i] = {
                    Medication: this.category,
                    data: [],
                    plotLines: [],
                    medType: mec[0].get('groupType')
                };

                series[i].data[0] = {
                    id: 'orders',
                    index: 0,
                    legendIndex: 0,
                    name: 'Order',
                    color: 'rgba(183, 220, 237, 0.5)',
                    lineWidth: 20,
                    marker: {
                        enabled: false
                    },
                    intervals: []
                };

                series[i].data[1] = {
                    id: 'fills',
                    index: 1,
                    legendIndex: 1,
                    name: 'Fill',
                    color: 'rgba(1, 152, 117, 0.7)',
                    // borderWidth: 1,
                    // borderColor: 'rgba(154, 9, 2, 0.9)',
                    // borderRadius: 10,
                    // borderRadiusTopLeft: 5,
                    // borderRadiusTopRight: 5,
                    // borderRadiusBottomRight: 10,
                    // borderRadiusBottomLeft: 10,
                    lineWidth: 12,
                    lineColor: 'rgba(1, 152, 117, 0.7)',
                    shadow: true,
                    marker: {
                        enabled: false,
                    },
                    intervals: []
                };

                series[i].data[2] = {
                    index: 2,
                    legendIndex: 2,
                    name: 'Order',
                    lineWidth: 0,
                    showInLegend: true,
                    linkedTo: 'orders',
                    marker: {
                        symbol: 'circle',
                        enabled: true,
                        radius: 10,
                        fillColor: 'rgba(183, 220, 237, 0.7)',
                        lineColor: 'rgba(183, 220, 237, 0.7)'
                    },
                    intervals: []
                };

                series[i].data[3] = {
                    index: 3,
                    legendIndex: 3,
                    name: 'Fill',
                    lineWidth: 0,
                    linkedTo: 'fills',
                    showInLegend: true,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 6,
                        fillColor: 'rgba(1, 152, 117, 0.7)',
                        lineColor: 'rgba(1, 152, 117, 0.7)'
                    },
                    intervals: []
                };

                series[i].data[4] = {
                    index: 4,
                    legendIndex: 4,
                    name: 'Discontinued',
                    marker: {
                        symbol: 'square',
                        enabled: true,
                        fillColor: 'rgba(159, 26, 8, 0.7)',
                        radius: 4
                    },
                    intervals: []
                };

                series[i].data[5] = {
                    index: 5,
                    legendIndex: 5,
                    name: 'Expired',
                    marker: {
                        symbol: 'diamond',
                        enabled: true,
                        radius: 3,
                        fillColor: 'rgba(0, 0, 0, 0.7)',
                        lineColor: 'rgba(0, 0, 0, 0.7)'
                    },
                    intervals: []
                };

                series[i].data[6] = {
                    index: 6,
                    legendIndex: 6,
                    name: 'Hold',
                    lineWidth: 20,
                    color: 'rgba(227, 227, 229, 0.3)',
                    marker: {
                        enabled: false
                    },
                    intervals: []
                };

                var medicationType = medis[i].attributes.meds.models[0].get('groupType');
                var outpatient = medicationType.indexOf("O");
                var nonva = medicationType.indexOf("N");
                var inpatient = medicationType.indexOf("I");

                if (outpatient === 0) {
                    oArray.push({
                        medication: this.category,
                        type: "O"
                    });
                }
                if (nonva === 0) {
                    nArray.push({
                        medication: this.category,
                        type: "N"
                    });
                }
                if (inpatient === 0) {
                    iArray.push({
                        medication: this.category,
                        type: "I"
                    });
                }

                //TODO Maybe refactor to use underscore each
                for (var j = 0; j < mec.length; j++) {
                    var fills = mec[j].get('fills');
                    var dosages = mec[j].get('dosages');
                    var fromOrderYear, fromOrderMonth, fromOrderDay, toOrderFillYear, toOrderFillMonth, orderDuration,
                        toOrderFillDay, toOrderYear, toOrderMonth, toOrderDay, stoppedYear, stoppedMonth, stoppedDay,
                        orderFillDate;

                    if ((mec[j].get('overallStart')).length === 14) {
                        fromOrderYear = moment(mec[j].get('overallStart'), "YYYYMMDDHHmmss").format("YYYY");
                        fromOrderMonth = moment(mec[j].get('overallStart'), "YYYYMMDDHHmmss").format("MM");
                        fromOrderDay = moment(mec[j].get('overallStart'), "YYYYMMDDHHmmss").format("DD");
                    } else if ((mec[j].get('overallStart')).length === 12) {
                        fromOrderYear = moment(mec[j].get('overallStart'), "YYYYMMDDHHmm").format("YYYY");
                        fromOrderMonth = moment(mec[j].get('overallStart'), "YYYYMMDDHHmm").format("MM");
                        fromOrderDay = moment(mec[j].get('overallStart'), "YYYYMMDDHHmm").format("DD");
                    } else {
                        fromOrderYear = moment(mec[j].get('overallStart'), "YYYYMMDD").format("YYYY");
                        fromOrderMonth = moment(mec[j].get('overallStart'), "YYYYMMDD").format("MM");
                        fromOrderDay = moment(mec[j].get('overallStart'), "YYYYMMDD").format("DD");
                    }

                    if ((mec[j].get('overallStop')).length === 14) {
                        toOrderYear = moment(mec[j].get('overallStop'), "YYYYMMDDHHmmss").format("YYYY");
                        toOrderMonth = moment(mec[j].get('overallStop'), "YYYYMMDDHHmmss").format("MM");
                        toOrderDay = moment(mec[j].get('overallStop'), "YYYYMMDDHHmmss").format("DD");
                    } else if ((mec[j].get('overallStop')).length === 12) {
                        toOrderYear = moment(mec[j].get('overallStop'), "YYYYMMDDHHmm").format("YYYY");
                        toOrderMonth = moment(mec[j].get('overallStop'), "YYYYMMDDHHmm").format("MM");
                        toOrderDay = moment(mec[j].get('overallStop'), "YYYYMMDDHHmm").format("DD");
                    } else {
                        toOrderYear = moment(mec[j].get('overallStop'), "YYYYMMDD").format("YYYY");
                        toOrderMonth = moment(mec[j].get('overallStop'), "YYYYMMDD").format("MM");
                        toOrderDay = moment(mec[j].get('overallStop'), "YYYYMMDD").format("DD");
                    }

                    var overallStart = fromOrderYear + "" + fromOrderMonth + "" + fromOrderDay;
                    var overallStop = toOrderYear + "" + toOrderMonth + "" + toOrderDay;

                    if (overallStart < overallStop) {
                        series[i].data[0].intervals.push({
                            from: Date.UTC(fromOrderYear, fromOrderMonth - 1, fromOrderDay),
                            to: Date.UTC(toOrderYear, toOrderMonth - 1, toOrderDay)
                        });
                    } else if (overallStart === overallStop) {
                        if (fills.length > 0) {

                            toOrderFillYear = moment(fills[0].dispenseDate, "YYYYMMDD").format("YYYY");
                            toOrderFillMonth = moment(fills[0].dispenseDate, "YYYYMMDD").format("MM");
                            toOrderFillDay = moment(fills[0].dispenseDate, "YYYYMMDD").format("DD");

                            if (fills[0].daysSupplyDispensed !== undefined) {
                                if (fills[0].daysSupplyDispensed === 1) {
                                    series[i].data[2].intervals.push({
                                        from: Date.UTC(fromOrderYear, fromOrderMonth - 1, fromOrderDay),
                                        to: Date.UTC(toOrderYear, toOrderMonth - 1, toOrderDay)
                                    });
                                } else if (fills[0].daysSupplyDispensed > 1) {
                                    orderDuration = moment.duration({
                                        'days': fills[0].daysSupplyDispensed
                                    });

                                    orderFillDate = moment([toOrderFillYear, toOrderFillMonth, toOrderFillDay]).add(orderDuration);

                                    series[i].data[0].intervals.push({
                                        from: Date.UTC(fromOrderYear, fromOrderMonth - 1, fromOrderDay),
                                        to: Date.UTC(orderFillDate.year(), orderFillDate.months() - 1, orderFillDate.days())
                                    });
                                }
                            } else {
                                series[i].data[0].intervals.push({
                                    from: Date.UTC(fromOrderYear, fromOrderMonth - 1, fromOrderDay),
                                    to: Date.UTC(toOrderYear, toOrderMonth - 1, toOrderDay)
                                });
                            }
                        } else {
                            series[i].data[0].intervals.push({
                                from: Date.UTC(fromOrderYear, fromOrderMonth - 1, fromOrderDay),
                                to: Date.UTC(toOrderYear, toOrderMonth - 1, toOrderDay)
                            });
                        }
                    }

                    if (mec[j].get('stopped') !== undefined) {
                        if ((mec[j].get('stopped')).length === 14) {
                            stoppedYear = moment(mec[j].get('stopped'), "YYYYMMDDHHmmss").format("YYYY");
                            stoppedMonth = moment(mec[j].get('stopped'), "YYYYMMDDHHmmss").format("MM");
                            stoppedDay = moment(mec[j].get('stopped'), "YYYYMMDDHHmmss").format("DD");
                        } else if ((mec[j].get('stopped')).length === 12) {
                            stoppedYear = moment(mec[j].get('stopped'), "YYYYMMDDHHmm").format("YYYY");
                            stoppedMonth = moment(mec[j].get('stopped'), "YYYYMMDDHHmm").format("MM");
                            stoppedDay = moment(mec[j].get('stopped'), "YYYYMMDDHHmm").format("DD");
                        } else {
                            stoppedYear = moment(mec[j].get('stopped'), "YYYYMMDD").format("YYYY");
                            stoppedMonth = moment(mec[j].get('stopped'), "YYYYMMDD").format("MM");
                            stoppedDay = moment(mec[j].get('stopped'), "YYYYMMDD").format("DD");
                        }

                        if (mec[j].get('vaStatus').toUpperCase() === "DISCONTINUED" || mec[j].get('vaStatus').toUpperCase() === "DISCONTINUED/EDIT") {
                            series[i].data[4].intervals.push({
                                from: Date.UTC(stoppedYear, stoppedMonth - 1, stoppedDay),
                                to: Date.UTC(stoppedYear, stoppedMonth - 1, stoppedDay)
                            });
                        }
                        if (mec[j].get('vaStatus').toUpperCase() === "EXPIRED") {
                            series[i].data[5].intervals.push({
                                //pointWidth: parseInt(dosages[0].dose),
                                from: Date.UTC(stoppedYear, stoppedMonth - 1, stoppedDay),
                                to: Date.UTC(stoppedYear, stoppedMonth - 1, stoppedDay)
                            });
                        }
                        if (mec[j].get('vaStatus').toUpperCase() === "HOLD") {
                            series[i].data[6].intervals.push({
                                //pointWidth: parseInt(dosages[0].dose),
                                from: Date.UTC(fromOrderYear, fromOrderMonth - 1, fromOrderDay),
                                to: Date.UTC(toOrderYear, toOrderMonth - 1, toOrderDay)
                            });
                        }
                    }

                    if (fills.length > 0) {
                        for (var k = 0; k < fills.length; k++) {
                            var fromFillYear, fromFillMonth, fromFillDay, daysOfFill;

                            if ((fills[k].dispenseDate).length === 14) {
                                fromFillYear = moment(fills[k].dispenseDate, "YYYYMMDDHHmmss").format("YYYY");
                                fromFillMonth = moment(fills[k].dispenseDate, "YYYYMMDDHHmmss").format("MM");
                                fromFillDay = moment(fills[k].dispenseDate, "YYYYMMDDHHmmss").format("DD");
                            } else if ((fills[k].dispenseDate).length === 12) {
                                fromFillYear = moment(fills[k].dispenseDate, "YYYYMMDDHHmm").format("YYYY");
                                fromFillMonth = moment(fills[k].dispenseDate, "YYYYMMDDHHmm").format("MM");
                                fromFillDay = moment(fills[k].dispenseDate, "YYYYMMDDHHmm").format("DD");
                            } else {
                                fromFillYear = moment(fills[k].dispenseDate, "YYYYMMDD").format("YYYY");
                                fromFillMonth = moment(fills[k].dispenseDate, "YYYYMMDD").format("MM");
                                fromFillDay = moment(fills[k].dispenseDate, "YYYYMMDD").format("DD");
                            }

                            if (fills[k].daysSupplyDispensed === undefined) {
                                series[i].data[3].intervals.push({
                                    from: Date.UTC(fromFillYear, fromFillMonth - 1, fromFillDay),
                                    to: Date.UTC(fromFillYear, fromFillMonth - 1, fromFillDay)
                                });
                            } else {
                                fillDuration = moment.duration({
                                    'days': fills[k].daysSupplyDispensed
                                });

                                var fillDate = moment([fromFillYear, fromFillMonth, fromFillDay]).add(fillDuration);

                                series[i].data[1].intervals.push({
                                    from: Date.UTC(fromFillYear, fromFillMonth - 1, fromFillDay),
                                    to: Date.UTC(fillDate.year(), fillDate.months() - 1, fillDate.days())
                                });
                            }
                        }
                    }
                }
            }

            $.each(series, function(d, t) {
                if (oArray.length > 0) {
                    if ((oArray[0].medication === t.Medication) && (oArray[0].type === t.medType)) {
                        t.plotLines.push({
                            label: {
                                text: 'OUTPATIENT'
                            }
                        });
                    }
                }

                if (iArray.length > 0) {
                    if ((iArray[0].medication === t.Medication) && (iArray[0].type === t.medType)) {
                        t.plotLines.push({
                            label: {
                                text: 'INPATIENT'
                            }
                        });
                    }
                }

                if (nArray.length > 0) {
                    if ((nArray[0].medication === t.Medication) && (nArray[0].type === t.medType)) {
                        t.plotLines.push({
                            label: {
                                text: 'NON-VA'
                            }
                        });
                    }
                }
            });

            var chartO = ChartHelper.returnChartOptions(series.reverse());
            var chartInterval = setInterval(function() {
                if ($('#graphContainer')) {
                    clearInterval(chartInterval);
                    MR_Hchart = new Highcharts.Chart(chartO.outpatientChartOptions);
                }

            }, 500);

        }
    });
    return OutpatientItemView;
});
