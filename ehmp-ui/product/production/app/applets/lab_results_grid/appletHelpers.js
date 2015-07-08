define([
    "backbone",
    "underscore",
    'moment'
], function(Backbone, _, Moment) {
    'use strict';
    var appletHelpers = {

        getDateForChart: function(date) {
            var data = date + '';
            data = data.slice(0, 12);
            data = data.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5');
            data = new Moment(data).format('MMM DD YYYY HH:mm');
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
                zoomType: "x",
                panning: true,
                panKey: 'shift',
                events: {
                    selection: function(e) {
                        // var originalY = this.xAxis[0].options.labels.y;
                        // if(event.xAxis){
                        //     var selection = event.xAxis[0].axis;
                        //     console.log(this.xAxis[0].options.labels.rotation = 45);
                        //     this.xAxis[0].options.labels.y = 30;
                        //     this.redraw();

                        // } else {
                        //     this.xAxis[0].options.labels.rotation = 0;
                        //     this.xAxis[0].options.labels.y = originalY;
                        // }

                        // this.xAxis[0].update({labels:{rotation:90}});
                    }
                }
            },
            tooltip: {
                // crosshairs: true,
                // shared: true
            },
            title: {
                text: null
            },
            plotOptions: {
                series: {
                    dataLabels: {

                    }
                }
            },
            /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    millisecond: "%b %d %Y",
                    second: "%b %d %Y",
                    minute: "%b %d %Y",
                    hour: "%b %d %Y",
                    day: "%b %d %Y",
                    week: "%b %d %Y",
                    month: "%b %d %Y",
                    year: "%b %d %Y"
                }
                /*,
                minRange: 24 * 3600 * 1000*/
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            /*plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    },
                    enableMouseTracking: true
                }
            },*/
            credits: false,
            series: [{
                    data: [],
                    name: 'Lab Result',
                    showInLegend: false
                }]
                //end of chartOptions
        },
        setTimeSince: function(fromDate) {

            if (fromDate === undefined || fromDate === "") return undefined;
            var startDate = moment(fromDate, 'YYYYMMDDHHmmssSSS');
            var endDate = moment();

            var duration = moment.duration(endDate.diff(startDate));

            var years = parseFloat(duration.asYears());
            var days = parseFloat(duration.asDays());
            var months = parseFloat(duration.asMonths());
            var hours = parseFloat(duration.asHours());
            var min = parseFloat(duration.asMinutes());

            if (min > 0 && min < 60) {
                hours = 1;
            }
            //console.log(hours1);

            var lYear = "y";
            var lMonth = "m";
            var lDay = "d";
            var lHour = "h";
            var finalResult = "";
            if (months >= 24) {
                finalResult = Math.round(years) + lYear;
            } else if ((months < 24) && (days > 60)) {
                finalResult = Math.round(months) + lMonth;
            } else if ((days >= 2) && (days <= 60)) {
                finalResult = Math.round(days) + lMonth;
            } else if (days < 2) {
                finalResult = Math.round(hours) + lHour;
            }

            return finalResult;
        },
        getNumericTime: function(response) {
            if (response === undefined) return response;
            var str = response;
            var reg = /(\d+)/ig;
            var strReg = str.match(reg);
            str = str.substr(str.length - 1);
            switch (str) {
                case 'y':
                    if (strReg == 1) {
                        str = 'year';
                    } else str = 'years';
                    break;

                case 'm':
                    if (strReg == 1) {
                        str = 'month';
                    } else str = 'months';
                    break;

                case 'M':
                    if (strReg == 1) {
                        str = 'month';
                    } else str = 'months';
                    break;

                case 'd':
                    if (strReg == 1) {
                        str = 'month';
                    } else str = 'months';
                    break;

                case 'h':
                    if (strReg == 1) {
                        str = 'day';
                    } else str = 'days';
                    break;
            }
            response = strReg + ' ' + str;
            return response;
        },
        parseLabResponse: function(response) {

            // Check 'codes' for LOINC codes and Standard test name.
            var low = response.low,
                high = response.high;

            if (low && high) {
                response.referenceRange = low + '-' + high;
            }
            
            if (response.interpretationCode) {
                var temp = response.interpretationCode.split(":").pop();

                var flagTooltip = "";
                var labelClass = "label-danger";

                if (temp === "HH") {
                    temp = "H*";
                    flagTooltip = "Critical High";
                }
                if (temp === "LL") {
                    temp = "L*";
                    flagTooltip = "Critical Low";
                }
                if (temp === "H") {
                    flagTooltip = "Abnormal High";
                    labelClass = "label-warning";
                }
                if (temp === "L") {
                    flagTooltip = "Abnormal Low";
                    labelClass = "label-warning";
                }

                response.interpretationCode = temp;
                response.flagTooltip = flagTooltip;
                response.labelClass = labelClass;
            }

            if (response.categoryCode) {
                var categoryCode = response.categoryCode.slice(response.categoryCode.lastIndexOf(':') + 1);

                switch (categoryCode) {
                    case 'EM':
                    case 'MI':
                    case 'SP':
                    case 'CY':
                    case 'AP':
                        response.result = 'View Report';
                        if (!response.typeName) {
                            response.typeName = response.categoryName;
                        }
                        response.pathology = true;
                        break;
                }

            }

            return response;
        },
        getModalTitle: function(model) {
            return model.get('typeName') + ' - ' + model.get('specimen');
        },
        getObservedFormatted: function(observed) {
                var observedFormatted = '';
                if (observed) {
                    observedFormatted = moment(observed, 'YYYYMMDDHHmmssSSS').format('MM/DD/YYYY - HH:mm');
                }
                return observedFormatted;
            }
            // end of appletHelpers
    };

    return appletHelpers;
});
