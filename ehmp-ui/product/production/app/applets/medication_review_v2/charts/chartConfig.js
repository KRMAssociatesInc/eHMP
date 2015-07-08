define([
    'moment',
    'pattern-fill',
    'grouped_categories'
], function() {

    (function(H) {
        var defaultPlotOptions = H.getOptions().plotOptions,
            columnType = H.seriesTypes.column;

        defaultPlotOptions.xrange = H.merge(defaultPlotOptions.column, {});
        H.seriesTypes.xrange = H.extendClass(columnType, {
            type: 'xrange',

            translate: function() {
                columnType.prototype.translate.apply(this, arguments);
                var series = this,
                    xAxis = series.xAxis,
                    yAxis = series.yAxis,
                    barHeight = yAxis.len / ((yAxis.max - yAxis.min) + 1),
                    barWidth;

                H.each(series.points, function(point) {
                    barWidth = xAxis.translate(H.pick(point.x2, point.x + (point.len || 0))) - point.plotX;

                    if (_.isUndefined(point.height)) point.height = 10;

                    point.shapeArgs = {
                        x: point.plotX,
                        y: point.plotY - (point.height) / 2,
                        width: barWidth,
                        height: point.height
                    };
                    point.tooltipPos[0] += barWidth / 2;
                    point.tooltipPos[1] -= barHeight / 2;
                });
            },
            generatePoints: function() {
                columnType.prototype.generatePoints.apply(this, arguments);
                var series = this,
                    xAxis = series.xAxis,
                    max = Number.MIN_VALUE,
                    pointX2;
                H.each(series.points, function(point) {
                    pointX2 = H.pick(point.x2, point.x + (point.len || 0));
                    if (pointX2 > max) {
                        max = pointX2;
                    }
                });
                if (max > xAxis.max) {
                    series.xAxis.setExtremes(xAxis.min, max, true);
                }
            }
        });
    }(Highcharts));

    function chartConfig(graphData) {
        // console.log(graphData);
        (function(chartConfig) {
            var comparator = function(a, b) {
                return a.x - b.x;
            };
            for (var q = 0; q < chartConfig.series.length; q++) {
                chartConfig.series[q].data.sort(comparator);
            }
            return chartConfig;
        })(graphData);

        return {
            global: {
                useUTC: false,
                timezoneOffset: 5 * 60
            },
            chart: {
                plotBorderColor: '#BCBCBC',
                plotBorderWidth: 1,
                plotBackgroundColor: graphData.chart.plotBackgroundColor,
                height: graphData.chart.height,
                spacing: [1, 1, 1, 1],
                type: 'xrange',
                reflow: true
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                enabled: false
            },
            xAxis: {
                min: graphData.xAxis.min,
                max: graphData.xAxis.max,
                showEmpty: false,
                gridLineColor: graphData.xAxis.gridLineColor,
                gridLineWidth: graphData.xAxis.gridLineWidth,
                labels: {
                    enabled: graphData.xAxis.labels.enabled,
                    y: 14
                },
                tickColor: graphData.xAxis.tickColor,
                tickLength: graphData.xAxis.tickLength,
                tickWidth: graphData.xAxis.tickWidth,
                tickPosition: graphData.xAxis.tickPosition,
                startOnTick: false,
                endOnTick: false,
                opposite: true,
                type: 'datetime',
                plotLines: graphData.xAxis.plotLines
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
            yAxis: {
                gridLineWidth: 2,
                reversed: true,
                title: '',
                labels: {
                    enabled: false
                },
                categories: graphData.yAxis.categories
            },
            series: graphData.series
        };
    }
    return chartConfig;
});