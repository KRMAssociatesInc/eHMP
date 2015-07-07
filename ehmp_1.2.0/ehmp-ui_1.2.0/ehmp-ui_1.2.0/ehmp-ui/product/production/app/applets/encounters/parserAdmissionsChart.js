define([
    "moment",
    'underscore'
], function (moment, _) {
    'use strict';

    var specialAdmissions = {
        chartParser: function (data, debug) {
            var DEBUG = debug || false;
            var days = 0;
            var totalDays = 0;           
            var admissionChartData = [];
            var result = {chartData: [], durationDays: 0}; 
            var start;
            var stop;
            if (data) {
                for (var x = 0; x < data.length; x++) {
                    if (data[x].stay) {
                        admissionChartData.push(data[x].stay);
                    }
                }
            }
            for (var acdIterator = 0; acdIterator < admissionChartData.length; acdIterator++) {
               start = moment(admissionChartData[acdIterator].arrivalDateTime, 'YYYYMMDDHHmmssSSS');
                if (admissionChartData[acdIterator].dischargeDateTime) {
                    stop = moment(admissionChartData[acdIterator].dischargeDateTime, 'YYYYMMDDHHmmssSSS');
                    days = (moment.duration(start.diff(stop))).asDays();
                } else {
                    stop = moment();
                    days = (moment.duration(start.diff(stop))).asDays();
                }
                result.chartData.push([start,stop]);
                totalDays = totalDays + days;
            }
            result.durationDays = totalDays;  // Duration of admission by reasonName field
            return result;
        }
    };
    return specialAdmissions;
});