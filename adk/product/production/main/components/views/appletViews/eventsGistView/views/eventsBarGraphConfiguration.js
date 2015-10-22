define([
    'moment'
], function(moment) {

    function defaultEventGistChartOptions(graphData) {
        var now = moment.utc().startOf('day').valueOf();
        //var now = moment.utc(moment().format("YYYYMMDDHHmmssSSS"), "YYYYMMDD").valueOf();

        return {
            global: {
                useUTC: false,
                timezoneOffset: 5 * 60
            },
            chart: {
                animation: true,
                zoomType: '',
                type: 'column',
                spacing: [1, 1, 1, 1],
                backgroundColor: '#F2F2F2',
                events: {
                    click: function(e) {
                        $(e.target).closest('[data-toggle=popover]').trigger('click');
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: "",
                enabled: false
            },
            tooltip: {
                enabled: false,
                hideDelay: 10,
                borderWidth: 1,
                formatter: function() {
                    if (this.series.name === 'now') {
                        return "Now: " + Highcharts.dateFormat('%m/%d/%Y', this.x);
                    } else {
                        return Highcharts.numberFormat(this.y, 0) + ' on ' + Highcharts.dateFormat('%m/%d/%Y', this.x);
                    }
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    pointWidth: 6
                },
                column: {
                    grouping: false,
                    shadow: false
                }
            },
            xAxis: {
                labels: {
                    enabled: false,
                    style: {
                        color: 'red',
                        fontSize: 8
                    }
                },
                plotLines: [{
                    color: '#F20000',
                    value: now,
                    dashStyle: 'solid',
                    width: 2,
                    zIndex: 5
                }],
                type: 'datetime',
                tickWidth: 1,
                startOnTick: false,
                endOnTick: false
            },
            yAxis: [{
                labels: {
                    enabled: false
                },
                lineWidth: 1,
                minPadding: 0.1,
                title: {
                    enabled: false
                },
            }, {
                lineWidth: 1,
                opposite: true,
                title: {
                    enabled: false
                }
            }],
            series: [{
                data: graphData.series || [],
                pointRange: 24 * 3600 * 1000 * 30,
                color: 'rgb(124, 181, 236)'
            }, {
                pointRange: 24 * 3600 * 1000 * 30,
                data: [
                    [graphData.oldestDate, 0],
                    [graphData.newestDate, 0]
                ]
            }]
        };
    }

    return defaultEventGistChartOptions;
});