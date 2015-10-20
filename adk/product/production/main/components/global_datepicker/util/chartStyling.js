define([
    'backbone',
    'marionette',
    'moment',
], function(Backbone, Marionette, moment) {


    return {

        allEventsChartStyles: {
            chart: {
                backgroundColor: '#001924',
                height: 125,
                width: 682,
                marginTop: 35,
                marginBottom: 25,
                events: {
                    selection: $.noop
                },
                style: {
                    // cursor: 'col-resize'
                },
                spacingRight: 20

            },
            legend: {
                align: 'left',
                verticalAlign: 'top',
                reversed: true,
                floating: true,
                width: 0,
                y: -12,
                color: '#FFFFFF'
            },
            series: [{
                color: '#9acf09'
            }, {
                color: '#8ADDFF'

                /**{
                    pattern: '_assets/img//outpatient-diag-pat.svg',
                    width: 5,
                    height: 5
                }**/
            }],
            title: {
                text: null
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#FFFFFF'
                    }
                },
                lineWidth: 2,
                lineColor: '#888888',
                plotLines: [{
                    color: '#FF0000',
                    width: 2,
                    value: moment().valueOf(),
                    zIndex: 99
                }]
            },
            plotOptions: {
                column: {
                    borderColor: '#000000',
                    borderWidth: 1,
                    pointWidth: 4
                }
            }
        },

        spikeLineChartStyles: {
            chart: {
                zoomType: '',
                events: {
                    selection: $.noop
                },
                margin: [0, 0, 0, 0],
                backgroundColor: '#001924',
                height: 32,
                width: 400
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointWidth: 6, //default, changes dynamically
                    borderWidth: 1,
                    borderColor: '#000000'
                }
            },

            series: [{
                color: '#9acf09'
            }, {
                color: '#8ADDFF'

                /**{
                    pattern: '_assets/img//outpatient-diag-pat.svg',
                    width: 5,
                    height: 5
                }**/
            }],
            xAxis: {
                labels: {
                    enabled: false
                },
                plotLines: [{
                    color: '#FF0000',
                    width: 2,
                    value: moment().valueOf(),
                    zIndex: 99
                }]
            },
            yAxis: {
                maxPadding: 0,
                minPadding: 0,
                endOnTick: false,
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                positioner: function() {
                    return {
                        y: 40
                    };
                },
                dateTimeLabelFormats: {
                    year: '%Y'
                },
                shared: true
            }
        }
    };
});