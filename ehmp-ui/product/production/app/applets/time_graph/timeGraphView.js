//----------------------------------------
// Name:        Time Line Applet
// File:        timeGraphView.js
// Screen:      NewsFeed.js
// Version:     1.5
// Date:        2014-09-26
// Modified:    2014-11-18
// Team:        Jupiter
// Description: Time Line chart view for Time Line Applet
//----------------------------------------
define([
    "jquery",
    "backbone",
    "marionette",
    "highcharts",
    "moment",
    "hbs!app/applets/time_graph/chartView",
    "app/applets/time_graph/appHelper",
    "app/applets/time_graph/debugFlag"
], function($, Backbone, Marionette, highcharts, moment, chartView, AppHelper, DEV) {
    'use strict';
    // Switch ON/OFF debug info
    var DEBUG = DEV.flag;
    // Switch on/off graph representation by event types
    var eventsByType = DEV.eventsByType;

   function timeRangeSelection(event) {
            if (event.xAxis) {
                if (DEBUG) console.log(event);
                if(DEV.filtering_mode === "nf_master") {
                    if (AppHelper.chartOptions.chart.zoomType === ""){
                        event.preventDefault();
                        return;
                    }
                }
                //$(".tl_reset").show(); moment(event.xAxis[0].min, "X").format("MMMM YYYY")
                //if (DEBUG) console.log("Start -->>" + highcharts.dateFormat('%m %Y', event.xAxis[0].min));
            //    if (DEBUG) console.log("Start -->>" + moment(event.xAxis[0].min).format()); //"MMMM DD YYYY"
                if (DEBUG) console.log("Start -->>" + highcharts.dateFormat("%m %d %Y",event.xAxis[0].min)); //"MMMM DD YYYY"
                //if (DEBUG) console.log("Start -->>" + event.xAxis[0].axis.categories[Math.round(event.xAxis[0].min)]);
                //if (DEBUG) console.log("Stop  -->>" + event.xAxis[0].axis.categories[Math.round(event.xAxis[0].max)]);
                if (DEBUG) console.log("Stop  -->>" + highcharts.dateFormat("%m %d %Y",event.xAxis[0].max)); //"MMMM DD YYYY"
                ADK.Messaging.getChannel("time_line_internal").trigger('setFilter');
                // Send filtering request to News Feed applet
                ADK.Messaging.getChannel("time_line").trigger('setTimeRangeFilter', {
                    type: "time_line_filter",
                    start: highcharts.dateFormat("%d-%B-%Y",event.xAxis[0].min),//moment(event.xAxis[0].min).format("DD-MMM-YYYY"),
                    stop:  highcharts.dateFormat("%d-%B-%Y",event.xAxis[0].max),//moment(event.xAxis[0].max).format("DD-MMM-YYYY"),
                    mode: DEV.filtering_mode
                });
                    return true;
            }
    }

    AppHelper.chartOptions.chart.events = {
                                            selection:  timeRangeSelection
                                        };

    var GraphView = Backbone.Marionette.ItemView.extend({
        //container: {},
        template: chartView,
        defaultRange: "",
        statusFiltered: false,
        timeChart: null,
        htmlTableView: "",
        chartOptions: AppHelper.chartOptions,
        events: {
                'click .tl_reset': 'buttonReset',
                'keydown': 'onKey'
        },
        initialize: function() {
            this._super = Backbone.Marionette.ItemView.prototype;
            var channel = ADK.Messaging.getChannel('time_line');
            this.listenTo(channel, 'resetGraph', function(params) {
                if(this.statusFiltered) this.buttonReset();
            }, this);
            this._super.initialize.apply(this, arguments);
        },
        buttonReset: function(){
            if (DEBUG) console.log("reset->click");
            ADK.Messaging.getChannel("time_line").trigger('clearTimeRangeFilter');
            // Reset TL title to dafault time range
            ADK.Messaging.getChannel("time_line_internal").trigger('resetFilter'); 
        },
        onKey: function(e){
            var code = e.keyCode || e.which;
            if (DEBUG) console.log("reset->click");
            if (code == 27) { //ESC
                this.buttonReset();
            }
        },
        setChartData: function(dataSet){
            var max = 0;
            var dm;
            var eventsDictionary ={};
            if(dataSet.msg == 'ok'){
                // reset chart data
                //this.chartOptions.xAxis.categories = [];
                var i, n;
                
                for(i=0;i<this.chartOptions.series.length;i++){
                    if(eventsByType){
                        this.chartOptions.series=[];
                        this.chartOptions.legend.enabled=true;
                    }else{
                        this.chartOptions.series[i].data = [];
                    }
                }
                // set chart data
                if(dataSet.nEvents>0){
                                            var dHours = 0;
                        var eventSubElements ={};
                    // creation of events dictionary
                    if(eventsByType){
                        for(n=0; n<dataSet.eventsByType.length; n++){
                            eventsDictionary[dataSet.eventsByType[n][0]]=n;
                            // Series initialization
                            this.chartOptions.series.push({ yAxis: 0, data: [], name: "",color: "", type: 'column' }); //color:'#FF0000',
                           // { yAxis: 0, data: [] } //, name: "events", type: 'column'
                        } 
                      if (DEBUG) console.log("eventDictionary----->>" + JSON.stringify(eventsDictionary));
                    }
                    for (i = 0; i < dataSet.nEvents; i++) {
                        //this.chartOptions.xAxis.categories.push(moment(dataSet[i][0], "YYYYMM").format("MMM-YYYY"));

                        if(eventsByType){
                        dm = new Date(moment(dataSet.agrData[i][0], "YYYYMMDD").format("YYYY"), //UTC
                                    moment(dataSet.agrData[i][0], "YYYYMMDD").format("MM")-1,
                                    moment(dataSet.agrData[i][0], "YYYYMMDD").format("DD"),12);                            
                            dHours = 0;
                            eventSubElements = dataSet.agrData[i][1].eventsByTypes;
                            //console.log(dataSet.agrData[i][1].event_types.length);
                             for(var sElement in eventSubElements){
                                dHours=dHours+2;
                                // set time shift on chart (+2hour)
                                dm.setHours(dm.getHours() + dHours);
                                this.chartOptions.series[eventsDictionary[sElement]].name = sElement;
                                this.chartOptions.series[eventsDictionary[sElement]].color = AppHelper.getColorByType(sElement);
                                this.chartOptions.series[eventsDictionary[sElement]].data.push([Date.UTC(dm.getFullYear(),dm.getMonth(),dm.getDate()), eventSubElements[sElement]]);
                                if (DEBUG) console.log(dm+"| event type----->>"+sElement+ " index--->> "+eventsDictionary[sElement]+" event value---->>"+eventSubElements[sElement]);
                                if (DEBUG) console.log("UTC-->> "+dm.getFullYear()+" - "+(dm.getMonth()+1)+" - "+dm.getDate());
                                 // set chart scale
                                if(max < eventSubElements[sElement]) max = eventSubElements[sElement];
                             }

                        }else{
                        dm = Date.UTC(moment(dataSet.agrData[i][0], "YYYYMMDD").format("YYYY"), //UTC
                                    moment(dataSet.agrData[i][0], "YYYYMMDD").format("MM")-1,
                                    moment(dataSet.agrData[i][0], "YYYYMMDD").format("DD"),12);                            
                            this.chartOptions.series[0].data.push([dm, dataSet.agrData[i][1].total]);
                            // set chart scale
                            if(max < dataSet.agrData[i][1].total) max = dataSet.agrData[i][1].total;
                        }
                    }
                    // set chart scale
                    this.chartOptions.yAxis.max = max;// + 5;
                    if (DEBUG) console.log("Max Y scale for Chart ----->>" + this.chartOptions.yAxis.max);
                    // set xAxis start point
                    dm = Date.UTC(moment(dataSet.firstEvent, "YYYYMMDD").format("YYYY"),
                                moment(dataSet.firstEvent, "YYYYMMDD").format("MM")-1,
                                moment(dataSet.firstEvent, "YYYYMMDD").format("DD"),12);
                    this.chartOptions.plotOptions.series.pointStart = dm;
                    //  tooltip data&position correction !!!
                    this.chartOptions.plotOptions.column.cropThreshold = dataSet.nEvents;
                    // table view generation for 508 ???
                    this.tableView();

                }else{
                    //nothing to do
                }
            }

        },
        showChart: function(){
            if (DEBUG) console.log("Show Time-graph chart ----->>");
            if(DEV.no_data_hide_div) $(".time-chart-container-header").show(); //???
            if(this.timeChart !== null){
                //this.timeChart.redraw();
                if(eventsByType){ // VR 11-19-14  somthing wrong with series remove !!!!!!!!!!!!!
                    var series;
                    var chart_series = this.timeChart.series.length;
                    for(series=0;series<this.timeChart.series.length;series++){
                        this.timeChart.series[0].remove(false);
                    }
                    if (DEBUG) console.log("Time-graph chart series removed ----->> "+series+" from " +chart_series);
                    for(series=0;series<this.chartOptions.series.length;series++){
                        this.timeChart.addSeries(this.chartOptions.series[series]);
                        if (DEBUG) console.log("Adding series---> "+series);
                    }
                    if (DEBUG) console.log("Time-graph chart series added ----->> "+series+" from " +this.chartOptions.series.length);
                }else{
                    this.timeChart.series[0].setData(this.chartOptions.series[0].data);
                }
            }else{
                if (DEBUG) console.log("Time-graph chart series on init ----->> "+this.chartOptions.series.length);
                this.timeChart = new Highcharts.Chart(this.chartOptions);
            }
        },

        tableView: function(){
           var html ="<table><tr><th>Time</th><th>"+this.chartOptions.series[0].name+"</th></tr>";
           var length = this.chartOptions.series[0].data.length;
           for(var i=0;i<length;i++){
                html+= "<tr><td>"+moment(this.chartOptions.series[0].data[i][0]).format("YYYY-MM-DD")+"</td><td>"+this.chartOptions.series[0].data[i][1]+"</td><tr>";
           }
           html+="</table>";
           this.htmlTableView=html;
           if (DEBUG) console.log("Table view--->>"+html);
           $("#time-chart-table").html(html);
           return html;
        },
    });
    return GraphView;
});
