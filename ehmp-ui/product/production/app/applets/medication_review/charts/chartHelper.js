define([
    "backbone",
    "highcharts",
    "moment"
], function(Backbone, highcharts, moment) {

    var ChartHelperFunctions = {
        returnChartOptions: function(medicationSeries) {
            var statusDict = {};
            var series = [];
            var height = 0;
            var medicationNames = [];
            var datePoint = [];
            var plotLines = [];
            var today = new Date().getTime();

            var maximumPadding;
            var minimumPadding;

            $.each(medicationSeries, function(i, medSeries) {
                var medicationName = medSeries.Medication;
                medicationNames.push(medicationName);
                height = i;

                $.each(medSeries.plotLines, function(f, plot) {
                    plotLines.push({
                        value: height + '.4',
                        color: 'green',
                        dashStyle: 'LongDashDotDot',
                        width: 1,
                        zIndex: 100,
                        label: {
                            text: plot.label.text,
                            style: {
                                fontWeight: 'bold',
                                fontSize: '100%'
                            }
                        }
                    });
                });

                $.each(medSeries.data, function(j, seriesData) {
                    var status = {
                        id: seriesData.id,
                        index: seriesData.index,
                        linkedTo: seriesData.linkedTo,
                        legendIndex: seriesData.legendIndex,
                        name: seriesData.name,
                        color: seriesData.color,
                        lineWidth: seriesData.lineWidth,
                        lineColor: seriesData.lineColor,
                        width: seriesData.width,
                        fillColor: seriesData.fillColor,
                        shadow: seriesData.shadow,
                        marker: seriesData.marker,
                        line: seriesData.line,
                        showInLegend: seriesData.showInLegend,
                        pointPadding: seriesData.pointPadding,
                        data: []
                    };

                    $.each(seriesData.intervals, function(k, interval) {
                        //TODO : Refactor this code to not repeat these series like this
                        status.data.push({
                            name: status.name,
                            x: interval.from,
                            y: height,
                            from: interval.from,
                            to: interval.to
                        }, {
                            name: status.name,
                            x: interval.to,
                            y: height,
                            from: interval.from,
                            to: interval.to
                        });
                        datePoint.push(interval.from);
                        if (seriesData.intervals[k + 1]) {
                            status.data.push(
                                [(interval.to + seriesData.intervals[k + 1].from) / 2, null]);
                        }
                    });

                    if (status.data.length > 0) {
                        if (status.name in statusDict) {
                            var statStart = status.data[0].from;
                            var prevStatEnd = statusDict[status.name].data[statusDict[status.name].data.length - 1].to;
                            statusDict[status.name].data.push([(prevStatEnd + statStart) / 2, null]);

                            statusDict[status.name].data = statusDict[status.name].data.concat(status.data);

                        } else {
                            statusDict[status.name] = status;
                        }

                    }
                });
            });

            if (height < 15) {
                maximumPadding = 0.1;
                minimumPadding = 0.06;
            } else if (height >= 15 && height <= 35) {
                maximumPadding = 0.04;
                minimumPadding = 0.04;
            } else {
                maximumPadding = 0.01;
                minimumPadding = 0.01;
            }

            $.each(statusDict, function(key, item) {
                series.push(item);
            });

            var ChartHelper = {
                outpatientChartOptions: {
                    chart: {
                        renderTo: 'graphContainer',
                        zoomType: 'y',
                        marginRight: 30,
                        alignTicks: false,
                        height: medicationSeries.length * 40,
                        resetZoomButton: {
                            relativeTo: 'chart',
                            theme: {
                                display: 'none'
                            }
                        },
                        events: {
                            selection: function(event) {
                                if (!this.zoomMode) {
                                    this.originalSize = {
                                        width: this.chartWidth,
                                        height: this.chartHeight
                                    };
                                }
                                var newHeight = Math.round((this.chartHeight * (event.yAxis[0].max - event.yAxis[0].min)) / (this.yAxis[0].max - this.yAxis[0].min));
                                if (newHeight < 400) newHeight = 400;
                                this.setSize(this.chartWidth, newHeight, false);
                                this.zoomMode = true;
                                $(".mr_reset").show();
                            }
                        },
                        marginBottom: 50
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ' '
                    },
                    xAxis: {
                        type: 'datetime',
                        minPadding: 0.10,
                        opposite: true,
                        gridLineColor: 'rgba(228,222,222, 0.4)',
                        gridLineWidth: 2
                    },
                    yAxis: {
                        showEmpty: false,
                        tickInterval: 1,
                        labels: {
                            formatter: function() {
                                if (medicationNames[this.value] !== undefined) {
                                    return '<b>' + medicationNames[this.value] + '</b>';
                                }
                            },
                            useHTML: true,
                            style: {
                                color: '#7C7B78',
                                fontWeight: 'bold'
                            }
                        },
                        startOnTick: false,
                        endOnTick: false,
                        title: {
                            text: 'Medications'
                        },
                        minPadding: minimumPadding,
                        maxPadding: maximumPadding,
                        plotLines: plotLines
                    },
                    tooltip: {
                        enabled: false,
                        crosshairs: false,
                        followPointer: false
                    },
                    plotOptions: {
                        series: {
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: true,
                        floating: true
                    },
                    series: series
                }
            };
            return ChartHelper;
        }
    };

    return ChartHelperFunctions;
});
