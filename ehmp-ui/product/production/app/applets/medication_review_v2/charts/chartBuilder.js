define(['moment'], function() {
    function chartBuilder(model) {
        var localListGraphData = {
            chart: {},
            name: model.get('name'),
            xAxis: {
                gridLineColor: '$grey-dark',
                gridLineWidth: 2,
                plotLines: [],
                labels: {
                    enabled: false
                },
            },
            yAxis: {
                categories: [{
                    name: '',
                    categories: []
                }]
            },
            series: [{
                borderWidth: 1,
                pointRange: 60 * 1000,
                data: [],
            }, {
                borderWidth: 1,
                pointRange: 60 * 1000,
                color: 'rgba(1, 152, 117, 0.3)',
                data: []
            }]
        };

        var sortDates = function(method) {
            method.facilityModelCollection.sort(function(a, b) {
                var c = new Date(a.get("overallStart"));
                var d = new Date(b.get("overallStart"));
                return c - d;
            });
        };

        var pushToLocalGraph = function(height, start, stop, color, index, seriesIndex, facilityMoniker, borderColor) {
            localListGraphData.series[seriesIndex].data.push({
                borderWidth: 3,
                borderColor: borderColor,
                height: height,
                x: start,
                x2: stop,
                y: index,
                color: color,
                facilityMoniker: facilityMoniker
            });
        };

        var checkBeforeOldestDates = function(begin, end, oldest) {
            var startDate;
            if ((begin <= oldest) && (end > oldest)) {
                startDate = oldest;
            } else {
                startDate = begin;
            }
            return startDate;
        };

        var checkAfterNewestDates = function(begin, end, newest) {
            var endDate;
            if ((begin <= newest) && (end > newest)) {
                endDate = newest;
            } else {
                endDate = end;
            }
            return endDate;
        };

        var green = 'rgba(153, 207, 3, 0.5)';
        var grey = 'rgba(215, 215, 215, 1)';
        var white = 'rgba(255, 255, 255, 1)';
        var blue = 'rgba(0, 153, 255, 0.5)';
        var color;
        var grey_pattern = {
            pattern: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAP0lEQVQYV2O8fv36f2lpaQZ8gPHTp0//nz59yoBPIVgRyBR8CuGK8ClEUYRLIYYibAqxKkJXiFMRskK8imAKAVBiOjbe4KWvAAAAAElFTkSuQmCC',
            width: 6,
            height: 6
        };
        var red_pattern = {
            pattern: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAPUlEQVQIW2P8zsHx//ePHwwgwMrBwcD54wcj4ycGhv8gDkiCj4GBESQJFwRxYBJgQZAKmA6wdrBhSABkBwDyohkM7A9p8gAAAABJRU5ErkJggg== ',
            width: 6,
            height: 6
        };
        var thirtytwo = 20;
        var ten = 10;
        var five = 5;
        var zero = 0;

        var allModelDataArray = [];
        var facilityCollection = model.get('unfilteredCollectionToGraph');
        var oldest = model.get('graphRelativeityOldestTime');
        var newest = model.get('graphRelativeityNewestTime');

        localListGraphData.chart.plotBackgroundColor = '#F2F2F2';
        localListGraphData.chart.height = 23;

        for (var t = 0; t < facilityCollection.length; t++) {

            var facilities = facilityCollection.at(t);
            var facilityMoniker = facilities.get('facilityMoniker');
            var facilityModelCollection = facilities.get('facilityMeds');

            if (facilityCollection.length > 1) {
                thirtytwo = 20;
                localListGraphData.chart.height = 23 * facilityCollection.length;
            }

            facilityModelCollection.comparator = 'overallStart';
            sortDates({
                facilityModelCollection: facilityModelCollection
            });

            for (var a = 0, b = 1; a < facilityModelCollection.length; a++) {
                var stoppedDate;
                stopped = moment(facilityModelCollection.models[a].stopped, 'YYYYMMDD');
                if (_.isUndefined(facilityModelCollection.models[b])) {
                    stoppedDate = facilityModelCollection.models[a].get('graphRelativeityNewestTime');
                } else {
                    stoppedDate = moment(facilityModelCollection.models[b].get('overallStart'), 'YYYYMMDD');
                }
                facilityModelCollection.models[a].set('calculatedStopDate', stoppedDate);
                b++;
            }

            for (var u = 0; u < facilityModelCollection.length; u++) {

                var overallStart, stopped, dispenseDate, vaStatus, newStoppedDate, calculatedStopDate, vaType;
                var modelInCollection = facilityModelCollection.at(u);
                var uid = modelInCollection.get('uid');
                localListGraphData.yAxis.categories[0].name = model.get('name');
                localListGraphData.yAxis.categories[0].categories.push(facilityMoniker);
                localListGraphData.xAxis.min = oldest;
                localListGraphData.xAxis.max = newest;
                localListGraphData.uid = uid;
                var administered = modelInCollection.get('administrations');
                var fills = modelInCollection.get('fills');
                var dosages = modelInCollection.get('dosages');
                if (dosages) {
                    localListGraphData.instructions = dosages[0].instructions;
                } else {
                    localListGraphData.instructions = '--';
                }
                vaStatus = modelInCollection.get('standardizedVaStatus').toLowerCase();
                overallStart = moment(modelInCollection.get('overallStart'), 'YYYYMMDD').valueOf();
                stopped = moment(modelInCollection.get('stopped'), 'YYYYMMDD').valueOf();
                calculatedStopDate = modelInCollection.get('calculatedStopDate');

                vaType = modelInCollection.get('vaType');
                if (overallStart > 0 && vaStatus !== "pending") {
                    if (moment(overallStart).isSame(stopped)) {
                        stopped = moment(stopped).add(1, 'minutes').valueOf();
                    }
                    if (moment(overallStart).isBefore(stopped) || moment(overallStart).isSame(stopped)) {

                        var greenLineDate = moment(model.get('greenLineDate'), 'YYYYMMDD').valueOf();
                        localListGraphData.xAxis.plotLines.push({
                            color: 'rgba(13, 131, 43, 0.7)',
                            value: greenLineDate,
                            dashStyle: 'solid',
                            width: 2,
                            zIndex: 5
                        }, {
                            color: '#f20000',
                            value: moment().valueOf(),
                            dashStyle: 'solid',
                            width: 1,
                            zIndex: 5
                        });

                        //Graph all Orders
                        pushToLocalGraph(thirtytwo, checkBeforeOldestDates(overallStart, stopped, oldest), checkAfterNewestDates(overallStart, stopped, newest), white, t, 0, facilityMoniker, white);

                        //Graph Fill for Non-Va
                        if (vaType === "N" && vaStatus === "active") {
                            pushToLocalGraph(ten, checkBeforeOldestDates(overallStart, stopped, oldest), checkAfterNewestDates(overallStart, stopped, newest), blue, t, 1, facilityMoniker, blue);
                        }

                        //Graph Expired or Discontinued
                        if (moment(stopped).isBefore(calculatedStopDate)) {
                            if (vaStatus === "discontinued") {
                                color = grey_pattern;
                            } else if (vaStatus === "active" || vaStatus === "expired" || vaStatus === "expires") {
                                color = grey;
                            }
                            pushToLocalGraph(thirtytwo, checkBeforeOldestDates(stopped, calculatedStopDate, oldest), checkAfterNewestDates(stopped, calculatedStopDate, newest), color, t, 0, facilityMoniker, color);
                        }

                        if (vaType === "O") {
                            if (fills) {
                                for (var c = 0; c < fills.length; c++) {
                                    dispenseDate = moment(fills[c].dispenseDate, 'YYYYMMDDHHmm').valueOf();
                                    if (_.isUndefined(fills[c].daysSupplyDispensed)) {
                                        pushToLocalGraph(ten, dispenseDate, dispenseDate, blue, t, 1, facilityMoniker);
                                    } else {
                                        var fillEndDate = moment(dispenseDate).add(fills[c].daysSupplyDispensed, 'days').valueOf();
                                        if (dispenseDate <= newest) {
                                            if (fillEndDate > newest) {
                                                fillEndDate = newest;
                                            }
                                            pushToLocalGraph(ten, checkBeforeOldestDates(dispenseDate, fillEndDate, oldest), checkAfterNewestDates(dispenseDate, fillEndDate, newest), blue, t, 1, facilityMoniker, blue);
                                        }
                                    }
                                }
                            }
                        } else if (vaType === "I") {
                            if (administered) {

                                for (var l = 0; l < administered.length; l++) {
                                    var admin = administered[l];
                                    var timeGiven = admin.dateTime;
                                    var status = admin.status;
                                    var given = admin.given;

                                    if (given === true && status === "GIVEN") {
                                        color = green;
                                        borderColor = green;
                                    } else if (status === "REFUSED") {
                                        color = red_pattern;
                                        borderColor = red_pattern;
                                    } else if (status === "HELD") {
                                        color = grey_pattern;
                                        borderColor = grey_pattern;
                                    } else {
                                        color = white;
                                        borderColor = white;
                                    }
                                    for (var f = 0; f < dosages.length; f++) {
                                        if (!isNaN(dosages[f].scheduleFreq)) {
                                            var timeGivenStart = moment(timeGiven, 'YYYYMMDDHHmm').valueOf();
                                            var timeGivenEnd = moment(timeGiven, 'YYYYMMDDHHmm').add(dosages[f].scheduleFreq, 'minutes').valueOf();
                                            pushToLocalGraph(ten, checkBeforeOldestDates(timeGivenStart, timeGivenEnd, oldest), checkAfterNewestDates(timeGivenStart, timeGivenEnd, newest), color, t, 1, facilityMoniker, color);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            chart: localListGraphData.chart,
            yAxis: localListGraphData.yAxis,
            series: localListGraphData.series,
            name: localListGraphData.name,
            instructions: localListGraphData.instructions,
            xAxis: localListGraphData.xAxis,
            uid: localListGraphData.uid
        };
    }
    return chartBuilder;
});