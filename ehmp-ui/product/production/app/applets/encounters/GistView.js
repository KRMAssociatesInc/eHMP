//----------------------------------------
// Name:        Encounters Applet
// File:        GistView.js      
// Version:     1.2
// Date:        2014-12-17
// Modified:    2015-03-09
// Team:        Jupiter
// Description: 
//----------------------------------------
define([
    "underscore",
    "jquery",
    "backbone",
    "marionette",
    "highcharts",
    "hbs!app/applets/encounters/templets/itemList",
    "hbs!app/applets/encounters/templets/item",
    "hbs!app/applets/encounters/templets/empty",
    "hbs!app/applets/encounters/templets/wrong",
    "app/applets/encounters/appConfig",
    "app/applets/encounters/appUtil",
    "app/applets/encounters/gistConfig"
], function(_, $, Backbone, Marionette, highcharts, gistView, item, emptyView, wrongView,  CONFIG, util, gistConfig) { //subItem,
    'use strict';
    // Switch ON/OFF debug info
    var DEBUG = CONFIG.debug;

    var gistOptions = {
            gistChartOptions: {
                        global: {
                            useUTC: false,
                            timezoneOffset: 5 * 60
                            }, 
                        chart: {
                            animation: true,
                            //height: 41,
                           // width: 130,                    
                            zoomType: '',
                            type: 'column',
                            spacing: [1,1,1,1],
                            backgroundColor: '#f3f3f3',
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
                                text: ""
                            },
                       tooltip: {
                            enabled: false,
                            //xDateFormat: '%Y-%m-%d'
                            //followPointer: true
                            hideDelay: 10,
                            borderWidth: 1,
                            formatter: function() {
                                return this.point.plotX;
                                /*if(this.series.name === 'now'){
                                    return "Now: "+ Highcharts.dateFormat('%m/%d/%Y',this.x);
                                }else{
                                    return  Highcharts.numberFormat(this.y, 0) +' on '+ Highcharts.dateFormat('%m/%d/%Y',this.x);
                                } */
                            }
                        },
                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                pointWidth: 5, //3
                                pointInterval: 24 * 3600 * 1000 * 30, // one month //day
                                enableMouseTracking: false
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
            type: 'datetime',            
            tickWidth: 0,
            startOnTick: false,
            endOnTick: false,
            plotLines: [{ // mark for the now
                color: '#F20000',
                value: util.nowChart(),
                dashStyle: 'solid', 
                width: 2,
                zIndex: 5
            }],            
           // max: +new Date + (6 * 24 * 3600 * 1000 * 30) // 6 month ahead
        },
        yAxis: [{
            //max: 10,
            labels: {
                enabled: false
            },
            lineWidth: 1,
            title: {
               enabled: false,
               text: "y Value" 
            },            
        },
              {
                  lineWidth: 1,
                  opposite: true,
                  title: {
                          enabled: false,
                          text: "y Value"
                } }            ],   
        series: [{
                data: [],
                type: 'column',
                name: "",
               // pointStart: Date.UTC(1985, 0, 1),
                pointRange: 24 * 3600 * 1000 *30,
                color: 'rgb(124, 181, 236)'
            },
            {
                data: [],
                type: 'column',
                color: '#206473',
                name: "now",
                //dashStyle: 'shortdot',
                pointRange: 24 * 3600 * 1000 *30
            }]
    
        }};    
    var gistUtil = {
        setPopover: function(obj){
          //  if (DEBUG) console.log(obj.$el.find('.gistList').position());
            var self = obj;
            obj.$el.find('.has-popover').popover({//has-popover//[data-toggle=popover]
                 trigger: 'manual', // click
                 html:'true',
                 container: 'body',
                 template:'<div class="popover popover-custom" style="max-width:100%" role="tooltip"> <div style="font-size:12px;padding:5px 5px;" class="popover-title"></div><div class="popover-content"></div></div>',   //<div class="arrow"></div>
                 //selector: 'has-popover',
                // viewport: { selector: 'body', padding: 0 },
                 placement: function(tip, element) { //$this is implicit
                    var position = $(element).position();
                    if (DEBUG) console.log("Position object ----->>"+ JSON.stringify(position));
                    return "bottom";
                }
             }).click(function(evt) {
                self.showPopover(evt, obj);
            }).focus(function(evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                $(obj).keyup(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        self.showPopover(evt, obj);
                    }
                });

            });        
        },
       
        reflowHChart: function(e){
                if (DEBUG) console.log("Enc Gist sub gist ----->> reflow chart");
                $( ".gChartMin" ).each(function() { // target each element with the .contains-chart class
                    if(!_.isUndefined($(this).highcharts())) $(this).highcharts().reflow(); // target the chart itself
                });            
        },
        setChartReflow: function(){
        // fix dimensions of chart that was in a hidden element
          $('#panel-encGist').on( 'shown.bs.collapse', this.reflowHChart);
        },
        offChartReflow: function(){
        // remove event handler
            $('#panel-encGist').off( 'shown.bs.collapse', this.reflowHChart);
        },
        showChart: function(obj) {
            if (DEBUG) console.log("Show Enc Gist showChart ----->> show gist item");
            // Reset Chart options 
            obj.gistOptions.gistChartOptions.series[0].data = [];
            //obj.gistOptions.gistChartOptions.series[0].pointStart = 0;
            obj.gistOptions.gistChartOptions.series[0].name = "";
            obj.gistOptions.gistChartOptions.series[1].data = [];
            obj.gistOptions.gistChartOptions.xAxis.plotLines[0].width = 0;
            obj.gistOptions.gistChartOptions.yAxis[0].max = null;
            //obj.gistOptions.gistChartOptions.series[1].pointStart = 0;
            var k, max;
            var $pointer = null;
            if(obj.model.get("processed")){
                if (DEBUG) console.log(obj.model.get("kind"));
                // prepare chart data  
                obj.gistOptions.gistChartOptions.series[0].name = obj.model.get("kind");
                max = 0;
                // if chart is empty -> set yAxis.max = 10
                if(obj.model.get("empty")){
                    obj.gistOptions.gistChartOptions.yAxis[0].max = 10;
                }
                // First event on the Chart
                obj.gistOptions.gistChartOptions.series[1].data.push([util.convertChartDate(obj.model.get("firstEvent")), 0]);
                // Now on the Chart if Now in selected time frame
                if((moment(util.nowChart()).isBefore(util.convertChartDate(obj.model.get("maxChart"))))&&(moment(util.nowChart()).isAfter(util.convertChartDate(obj.model.get("firstEvent"))))){
                    obj.gistOptions.gistChartOptions.xAxis.plotLines[0].width = 2;
                }
                // Right border of chart
                obj.gistOptions.gistChartOptions.series[1].data.push([util.convertChartDate(obj.model.get("maxChart")), 0]);
                if (DEBUG){ 
                    console.log("Enc Gist series[0] max value ----->> " + (max + 1));
                    console.log(obj.model.get("firstEvent"));
                    console.log(obj.model.get("maxChart"));                
                }
                //  tooltip data&position correction !!!
                obj.gistOptions.gistChartOptions.plotOptions.column.cropThreshold = obj.model.get("count");
                // Create Chart
                $pointer = obj.$el.find('#encounter-chart-container-' + obj.model.get("elKind"));
                $pointer.highcharts(obj.gistOptions.gistChartOptions);
                obj.$el.find('.highcharts-background').attr('fill', 'rgba(0,0,0,0)');
            }
            return $pointer;
        }, 
        chartReflow: function(obj){
                    var pointer;
                    var model;
                    if (typeof (obj.model) !== 'undefined' ) {
                      model = obj.model;
                    }else{
                      model = obj;
                    }
                    if(model.get("subKind")){
                        pointer = '#encounter-chart-subcontainer-' + model.get("elKind")+"-"+model.get("elSubKind");
                    }
                    else{
                        pointer = '#encounter-chart-container-' + model.get("elKind");
                    }
                    if (typeof ($(pointer).highcharts()) !== 'undefined' ){
                        $(pointer).highcharts().reflow();
                    }
        },
        binning_normal_function: function(val){return Math.log((val*val*val+1)/0.1);},  // Data normalization function
        chartDataBinning: function(obj){
            // ADK Binning & Normalization
            var model  = obj.model;
            var binned = [];
            var data   = [];
            var input  = {};
            var config = {
                           barPadding: 6,
                           normal_function: this.binning_normal_function,
                           debug: false
                         };
            if(!model.get("empty")){
                var pointer =  '#encounter-chart-container-' + model.get("elKind");
                var chartWidth = $(pointer).width();
                config.chartWidth = chartWidth; 
                    if (typeof ($(pointer).highcharts()) !== 'undefined' ){
                    input.series     = model.get("chartData");
                    input.isDuration = model.get("isDuration") || false;   
                    input.oldestDate = util.convertChartDate(model.get("firstEvent"));
                    input.newestDate = util.convertChartDate(model.get("maxChart"));
                    binned =  ADK.utils.chartDataBinning(input, config);               
                    $(pointer).highcharts().series[0].setData(binned);
                }                
            }
        }
    }; 
    var noRecords = Backbone.Marionette.ItemView.extend({
        template: emptyView
    });

    var iItem = Backbone.Marionette.CompositeView.extend({ 
        className: 'encGistItem',
        template: item,
        gistOptions: gistOptions,
        childViewContainer: ".gistSubList",
        chartPointer: null,
        initialize: function(){
            if(DEBUG) console.log("initialize ----->> iItem");
            $('[data-toggle=popover]').popover('hide'); 
            this.collection = this.model.get("node");
            
        },
        buildChildView: function(child, ChildViewClass, childViewOptions){
            if (!_.isUndefined(child.get('kind'))){
                var childOptions = {appletConfig:     { gistSubName:      child.get('kind'),
                                                        instanceId:       window.appletConfig.instanceId,
                                                        id:               window.appletConfig.id},
                                                        showInfoButton: window.showInfoButton,
                                                        gistHeaders:      gistConfig.gistHeaders[(child.get('kind').toLowerCase())],
                                                        gistModel:        gistConfig.gistModel,
                                                        collection:       child.get('collection'),
                                                        binningOptions:  { 
                                                                            barPadding: 6,
                                                                            normal_function: gistUtil.binning_normal_function,
                                                                            debug: false
                                                                          }
                               };
                return ADK.Views.EventGist.create(childOptions);
            }else{
                return wrongView;
            }
        },       
        events: {
            'click .left-side': 'onClickLeftSide',
            'click .right-side': 'onClickRightSide',
            'focus .info-display': function(event) {
                var gistItem = $(document.activeElement);
                gistItem.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        gistItem.trigger('click');
                    }
                });
            },            
            },
        caretStatus: false,
        caretOn: function(){
          this.$el.find("#caret").attr("class","caret");
        },
        caretOff: function(){
         this.$el.find("#caret").attr("class","right-caret"); //this.$el.find('.header').attr("sortDirection", 'none');
        },
        caretSwitch: function(){
             var arrowPosition = this.$el.find("#caret").attr("arrowPosition");
            if(arrowPosition === "right"){
                this.$el.find("#caret").attr("arrowPosition", "down");
                this.$el.find("#caret").attr("class","caret");
            }else if(arrowPosition === "down"){
                this.$el.find("#caret").attr("arrowPosition", "right");
                this.$el.find("#caret").attr("class","right-caret");
            }    
        },
        showPopover: function(e,obj) {
            e.preventDefault();
            var popoverElement = obj.$el.find('.has-popover');
            if(popoverElement.length !==0){
                popoverElement.popover('toggle');
            }else{
                $('[data-toggle=popover]').not(popoverElement).popover('hide');  
            }
        },         
        onClickRightSide: function(event){
            if(DEBUG) console.log(this.model.get('kind')+"-top-right-side");
            //this.$el.find('.has-popover').popover('show');
           // this.showPopover();
            event.preventDefault();
            event.stopImmediatePropagation();
        },        
        onClickLeftSide: function(event){
            event.preventDefault();
            event.stopImmediatePropagation(); 
            $('[data-toggle=popover]').popover('hide');
            if(DEBUG) console.log(this.model.get('kind')+"-top-left-side");
            if(!this.model.get('empty')){
                $("#subpanel--"+this.model.get('elKind')).collapse('toggle');
                this.caretSwitch();
            }
        },
        onRender: function() {
            // console.log("RENDER!!!");
            if (DEBUG) console.log("onRender ----->> iItem");
            this.chartPointer = gistUtil.showChart(this);
            gistUtil.setPopover(this);
            if (DEBUG) console.log(this.model.get("kind"));
        },
        onDomRefresh: function(){
            if (DEBUG) console.log("onDomRefresh ----->> iItem");
            gistUtil.chartDataBinning(this);
            gistUtil.chartReflow(this);
        },
        onBeforeDestroy: function() {
            if (this.chartPointer) {
                var chart = this.chartPointer.highcharts();
                if (chart) {
                    chart.destroy();
                }
            }
        }
    });

    function onCustomFilter(search) {
        if(DEBUG) console.log("Custom filter---->>"+ search);            
         ADK.Messaging.getChannel("encounters_internal").trigger("filter_collection",search);
    }

    function onClearCustomFilter() {
        if(DEBUG) console.log("Custom filter---->>clear");            
         ADK.Messaging.getChannel("encounters_internal").trigger("clear_filter");
    }

    var GistView = Backbone.Marionette.CompositeView.extend({
        template: gistView,
        emptyView: noRecords,
        childView: iItem,
        childViewContainer: ".encGistList",   
        gistOptions: gistOptions,
        initialize: function(options) {
            //this.$el.find('.has-popover').popover('hide');
            var self = this;
            $('html').click(function() {
                self.$('[data-toggle=popover]').popover('hide');
            });
            this.collection = options.collection;
            this.maximizeScreen = options.appletConfig.maximizeScreen;
             this._super = Backbone.Marionette.CompositeView.prototype;
            this._super.initialize.apply(this, arguments);
            // this.collection.on("filterDone", function() {
            //    // this.render();
            // }, this); 
            this.collection.on("customfilter", onCustomFilter, this);
            this.collection.on("clear_customfilter", onClearCustomFilter, this);
           this.collection.on("reset", function() {
                if (DEBUG)  console.log("EncGist ----->> Collection reset -->>GistView");
                if (DEBUG)  console.log(this.collection);
            }, this);                         
        },
       onShow: function(){
        if (DEBUG) console.log("Show Enc Gist onShow ----->>");
         gistUtil.setChartReflow();  
        },
      onBeforeDestroy: function(){
        if (DEBUG) console.log("Enc Gist onBeforeDestroy ----->>");
          gistUtil.offChartReflow();

          this.collection.off("customfilter", onCustomFilter, this);
          this.collection.off("clear_customfilter", onClearCustomFilter, this);
      }
    });
    
    
    return GistView;
});
