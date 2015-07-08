define([
    "backbone",
    "underscore",
    'moment'
], function(Backbone, _, Moment) {
    'use strict';
    var appletHelpers = {

        getDateForChart: function(date) {
            var data = date + '';
            data = data.slice(0, 8);
            data = data.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            data = new Moment(data).format('MMM DD YYYY');
            return data;
        },
        updateChart: function(chart, collection) {

            var categories = collection.pluck('observed');

            categories = _.map(categories, function(num) {
                return appletHelpers.getDateForChart(num);
            });
            var data = collection.pluck('resultNumber');
            chart.xAxis[0].setCategories(categories);
            chart.series[0].setData(data);

        },
        chartOptions: {
            chart: {
                type: 'line',
                renderTo: 'chart-container',
                zoomType: "x"
            },
            tooltip: {
                crosshairs: true
            },
            title: {
                text: null
            },
            /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            credits: false,
            series: [{
                data: [5.5, 10.1, 10.0, 50],
                name: 'Lab Result',
                showInLegend: false
            }]
            //end of chartOptions
        }
        // end of appletHelpers
    };

    return appletHelpers;
});
