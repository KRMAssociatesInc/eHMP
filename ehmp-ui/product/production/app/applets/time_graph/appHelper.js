//----------------------------------------
// Name:        Time Line Applet
// File:        appHelper.js
// Screen:      NewsFeed.js
// Version:     1.1
// Date:        2014-09-26
// Modified:    2014-11-17
// Team:        Jupiter
// Description: Helper for Time Line Applet
//----------------------------------------
define([
    "backbone",
    "moment"
], function(Backbone, Moment) {
    'use strict';
    var DEBUG = false;

    var appHelper = {

        dateAggregation: function(dateSet){
            var result = {};
            var eventTypes ={};
            var sortResult = [];
            var eventsResult = [];
            var finalResult = {};
                //finalResult.agrData[0] = ['20140101', {total:1, event_types:["none"]}];
            var displayFormat = 'YYYYMMDD'; //'YYYY-MMM';
            var sourceFormat = 'YYYYMMDDHHmmssSSS';

            if(DEBUG) console.log(finalResult); //JSON.stringify(dateSet)

            if(!$.isArray(dateSet)){ return {msg: "nodata"}; }  // input data is not correct
            if(dateSet.length === 0){ return {msg: "nodata"};}       // input data is empty
            for (var i = 0; i < dateSet.length; i++) {

                //var item = dateSet.models[i].attributes.dateTimeChart;
                var item = moment(dateSet[i].attributes.activityDateTime, sourceFormat).format(displayFormat);
                if(DEBUG) console.log(item);
                // aggrigation by year and month, day
                if (typeof result[item] === 'undefined') {
                    result[item] = {total: 1, event_types:[], eventsByTypes:{}};
                } else {
                    result[item].total++;
                }
                // add type of event
                result[item].event_types.push(dateSet[i].attributes.kind);
                // split events by types 
                if (typeof result[item].eventsByTypes[dateSet[i].attributes.kind] === 'undefined') {
                    result[item].eventsByTypes[dateSet[i].attributes.kind]=1;
                }else{    
                    result[item].eventsByTypes[dateSet[i].attributes.kind] = result[item].eventsByTypes[dateSet[i].attributes.kind]+1;
                }
                // aggregation by event type
                if (typeof eventTypes[dateSet[i].attributes.kind] === 'undefined') {
                    eventTypes[dateSet[i].attributes.kind]=1;
                } else {
                    eventTypes[dateSet[i].attributes.kind]++;
                }
            }
            if (DEBUG) console.log(result);
            if (DEBUG) console.log(eventTypes);
            if (DEBUG) console.log("elements in source data set---> " + i);
            var n =0;
            for (var date in result) {
                sortResult.push([date, result[date]]);
                n++;
            }

            sortResult.sort(function(a, b) {
                return a[0] - b[0];
            });
            // event types preraration
            for (var event_t in eventTypes) {
                eventsResult.push([event_t, eventTypes[event_t]]);
            }
            finalResult = {
                msg: "ok",
                eventsByType: eventsResult,
                agrData: sortResult,
                nEvents: sortResult.length,
                firstEvent: sortResult[0][0],
                lastEvent: sortResult[sortResult.length-1][0]
            };
            if (DEBUG) console.log(finalResult);
            return finalResult;
        },
        getColorByType: function(eventType){
               var color = "#FFFF00";
               switch (eventType.toLowerCase()) {
                case "consult":
                    color = "#0066FF";
                    break;
                case "immunization":
                    color = "#99FFCC";
                    break;
                case "admission":
                    color = "#6600FF";
                    break;
                case "visit":
                    color = "#66FF99";
                    break; 
                case "procedure":
                    color = "#006600";
                    break;
                case "surgery":
                    color = "#FF0000";
                    break; 
                case "consult":
                    color = "#00CC99";
                    break; 
                case "procedure":
                    color = "#FF6600";
                    break;                       
               }
            return color;        
        },

        // Configuration params for NF Time Line Applet
        chartOptions: {
                        global:{
                            useUTC: false,
                            timezoneOffset: 5 * 60
                        },
                        chart: {
                                renderTo: 'time-chart-container',
                                animation: false,
                                height: 170,
                                // width: 900,
                                zoomType: 'x',
                                resetZoomButton: {
                                        relativeTo: 'chart',
                                        theme: {
                                            display: 'none'
                                             //   fill: 'white',
                                             //   stroke: '#41739D',
                                             //   r: 0,
                                             //   states: {
                                             //       hover: {
                                             //           fill: '#41739D',
                                             //           style: {
                                             //               color: 'white'
                                             //           }
                                             //       }
                                             //   }
                                        }
                                },
                                type: 'column'
                               // events: {
                               //     selection:  timeRangeSelection,
                               // }
                        },
                        rangeSelector: {
                            allButtonsEnabled: true,
                            selected: 1
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: "",
                            enabled: false
                        },
                        xAxis: {
                            labels: {
                                rotation: 45,
                                align: 'left',
                                overflow: 'justify'
                            },
                            type: 'datetime',
                            //tickColor: '#F0C0A0',
                            tickWidth: 4,
                            //categories: []
                            //minRange: 86400000 //1 day
                            minTickInterval: 24 * 3600 * 1000 //86400000 //1 day
                        },
                        tooltip: {
                            xDateFormat: '%Y-%m-%d'
                            //followPointer: true
                        },
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                pointWidth: 8,
                                pointInterval: 24 * 3600 * 1000 // one day
                                //pointInterval: 12
                            },
                            column: {
                                grouping: false,
                                shadow: false
                            }
                        },
                        yAxis: [{
                                //max: 20,
                                lineWidth: 1,
                                title: {
                                    enabled: true,
                                    text: "Events"
                                },
                                tickPositioner: function () {
                                        if((this.dataMin !== null)&&(this.dataMax !== null)) {
                                            var positions = [];
                                            var tick = Math.floor(this.dataMin),
                                            increment = Math.ceil((this.dataMax - this.dataMin) / 2);
                                            for (tick; tick - increment <= this.dataMax; tick += increment) {
                                                positions.push(tick);
                                            }
                                            return positions;
                                        }
                                }
                            },
                            {
                                lineWidth: 1,
                                opposite: true,
                                title: {
                                    enabled: true,
                                    text: "Events"
                                },
                            }],

                       // },
                        legend: {
                            enabled: false,
                            floating: true,
                            layout: 'horizontal',
                            verticalAlign: 'middle',
                            align: 'right',
                            y: 75
                        },
                        series: [{
                            yAxis: 0,
                            data: [],
                            name: "events",
                            type: 'column'
                        }]
        }
        // end of appHelpers
    };

    return appHelper;
});
