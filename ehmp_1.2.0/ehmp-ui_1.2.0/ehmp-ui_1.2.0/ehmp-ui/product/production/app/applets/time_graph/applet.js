//----------------------------------------
// Name:        Time Line Applet
// Files:       applet.js, timeGraphView.js, appHelper.js, chartView.html, styles.css
// Screen:      NewsFeed.js
// Version:     1.1
// Date:        2014-09-25
// Modified:    2014-11-19
// Team:        Jupiter
// Description: Provides chart view and time range filtering event for News Feed Applet
// v 1.1 -  can show events by type  (debugFlag.js -> eventsByType: true) (issue with series refresh not fixed) 
//----------------------------------------
define([
    "jquery",
    "backbone",
    "marionette",
    "moment",
    "app/applets/time_graph/timeGraphView",
    "app/applets/time_graph/appHelper",
    "app/applets/time_graph/debugFlag"
], function($, Backbone, Marionette, moment, GraphView, AppHelper, DEV) {
    'use strict';
    // Switch ON/OFF debug info
    var DEBUG = DEV.flag;

    if (DEBUG) console.log("Time-graph initialization ----->>Start");


    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        initialize: function() {
            // Wait data from News Feed Applet
            ADK.Messaging.getChannel("time_line").on('nf_tl_data', this.prepareChart,this);
            ADK.Messaging.getChannel("time_line_internal").on('resetFilter', this.resetFilter,this);
            ADK.Messaging.getChannel("time_line_internal").on('setFilter', this.setFilter,this);

            var channel = ADK.Messaging.getChannel('time_line');
            this.listenTo(channel, 'resetGraph', function(params) {
                if (DEBUG) console.log("Time-graph got event ----->> resetGraph");
               // this.hideChart();
                //this.graphView.statusFiletered = false;
            }, this);
            this.graphView = new GraphView();
            this.graphView.on("show_chart", this.graphView.showChart);
            if (DEBUG) console.log("Time-graph initialization ----->>");
        },

        prepareChart: function(result) {
            var data = result.data;
            if (DEBUG) console.log(result);
            if (DEV.filtering_mode=="nf_master"){
                if (result.fmode){
                    if (DEBUG) console.log("NF Master Filtering mode---->> filter ON");
                    if(this.graphView.timeChart !== null) AppHelper.chartOptions.chart.zoomType = "";
                }else{
                    if (DEBUG) console.log("NF Master Filtering mode---->> filter OFF");
                    if(this.graphView.timeChart !== null) AppHelper.chartOptions.chart.zoomType = "x";
                }
            }
            if(typeof data !== 'undefined'){
                if(!this.graphView.statusFiltered){ //&&(data.length>0)
                    if (DEBUG) console.log("prepareChart---->>");
                    //  Prepare data for chart
                    var sortResult = AppHelper.dateAggregation(data);
                    if(sortResult.msg == 'ok'){
                        // set Chart Data
                        this.graphView.setChartData(sortResult);
                        // Shows time range title
                        // this.graphView.defaultRange=this.setTimeRangeTitle(moment(sortResult.firstEvent, "YYYYMM").format("MMMM YYYY"),"Present");
                        // Triggering Time graph creation when data ready
                        this.showChart();
                        this.graphView.trigger("show_chart");
                    }else{
                        this.hideChart();
                    if (DEBUG) console.log("Wrong data or no data for Chart---->>");
                    }
                }else{
                    if (DEBUG) console.log("Chart is in filtered status---->>");
                }
            }

        },
        setTimeRangeTitle: function(start,stop){
            var time_range = " ";
            time_range += start +" to "+ stop;
            if (DEBUG) console.log("---->>" + time_range);
            return time_range;
        },
        resetFilter: function(){   //switch off Zoom 
            if (DEBUG) console.log("Set default time range ---->>" + this.graphView.defaultRange);
            this.graphView.statusFiltered = false;
            $(".tl_reset").hide();
            if (this.graphView.timeChart) {
                this.graphView.timeChart.zoomOut();
            }
        },
        setFilter: function(){
            $(".tl_reset").show();
            this.graphView.statusFiltered = true;
        },
        hideChart: function(){   //VR 11-19-14  should be changed for events by type !!!!!!!!
            if(DEV.no_data_hide_div){
                if (DEBUG) console.log("Hide chart container ----->>");
                $(".time-chart-container-header").hide();
            }else{
                if (DEBUG) console.log("Hide series from chart  ----->>");
                if(this.graphView.timeChart !== null) this.graphView.timeChart.series[0].hide();
            }
        },
        showChart: function(){ //VR 11-19-14  should be changed for events by type !!!!!!!!
            if(DEV.no_data_hide_div){
                if (DEBUG) console.log("Show chart container ----->>");
                $(".time-chart-container-header").show();
            }else{
                if (DEBUG) console.log("Show series on the chart  ----->>");
                if(this.graphView.timeChart !== null) this.graphView.timeChart.series[0].show();
            }
        },
        onRender: function() {
            if (DEBUG) console.log("Time_graph rendering ----->>");
            this.appletMain.show(this.graphView);
        },

        template: _.template('<div id="time-line-main"></div>'),
        regions: {
            appletMain: "#time-line-main"
        }
    });
    var applet = {
        id: "time_graph",
        getRootView: function() {
            return AppletLayoutView;
        }
    };
    return applet;
});
