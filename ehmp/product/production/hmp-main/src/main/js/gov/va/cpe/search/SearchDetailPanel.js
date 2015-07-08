Ext.define("gov.va.cpe.search.SearchDetailPanel", {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.hmp.tabs.MedsPanel',
        'gov.va.hmp.tabs.ProblemsPanel',
        'gov.va.hmp.tabs.DocumentSearchPanel',
        'gov.va.hmp.tabs.OrderSearchPanel',
        'gov.va.hmp.tabs.InfobuttonSearchPanel',
        'gov.va.hmp.tabs.VisitSearchPanel',
        'gov.va.hmp.tabs.ImmunizationPanel',
        'gov.va.hmp.tabs.LabTextSearchPanel'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    alias: 'widget.searchdetail',
    config: {
        titleProperty: 'summary',
        detailItem: null,
        decorateFn: null
    },
    frame: true,
    closable: true,
    closeAction: 'hide',
    hidden: false,
    height: "auto",
    title: "Detail",
    itemId: "searchdetailid",
    bodyPadding: 0,
    margin: "0 5 5 0",
    autoScroll: true,
    html: 'No item selected.',
    layout: 'fit',
    loader: {
    	loadMask: true,
        ajaxOptions: {
            method: 'GET'
        },
        params: {
            format: 'html'
        },               
        listeners: {
            beforeload: function(loader, op, eopts) {
            	var target = loader.getTarget();
                target.removeAll();
                target.update("");
                
                op.skipErrors = true;
                if(target.body){
                	target.body.unmask();
                }
            }          
        },        
        renderer: function(loader, response, active) {
        	var detail = loader.getTarget();
            var text = response.responseText;
            if (Ext.isFunction(detail.getDecorateFn())) {
            	detail.getDecorateFn();
                text = detail.getDecorateFn().call(this, text);
            }
            detail.update(text, true);
        },
		failure: function(loader, response) {
			var target = loader.getTarget();
			// this looks like bug in JS when failure called if success is
			// undefined for loader
			// look in response status
			if(response.status!=200){
				target.update("");
				if(target.body){
					target.body.mask("Component Received an Error. Try Reloading.");
				}
			}
		}
    },
    listeners: {
    	close: function(panel) {
//    		console.log("SearchDetailPanel.close()");
    		// clear all result selections
    		var resultPanel = this.up('searchpanel').resultsPanel;
    		resultPanel.getSelectionModel().deselectAll();
    	},
        patientchange: function(pid) {
            this.pid = pid;
            this.removeAll();
            if (pid == 0) {
            	this.setTitle('Detail');
                this.update('No item selected.');
            }
        }
    },
    constructor: function(config) {
        this.initConfig(config);
        return this.callParent(arguments);
    },
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
    },
    updateChartData: function(chartData) {
    	var cfg = {
			xtype: 'chartpanel',
			legend: {position: 'top'},
			width: this.width,
			height: this.height,
			itemId: 'searchDetailChartPanelId'
    	};
    	this.removeAll();
    	var chartPanel = this.add(cfg);
    	var chartCfg = {
			xAxis: {
				name: 'Observation Time',
				tickPixelInterval: 150,
	            dateTimeLabelFormats: {
	                second: '%d-%b-%y<br/>%H:%M:%S',
	                minute: '%d-%b-%y<br/>%H:%M',
	                hour: '%d-%b-%y<br/>%H:%M',
	                day: '%d-%b<br/>%Y',
	                week: '%d-%b<br/>%Y',
	                month: '%y-%b',
	                year: '%Y'
	            },
        		labels: {rotation: 0, align: 'left'}
			},
			yAxis: {
				title: {
					text: chartData[0].units
				}
			},
			tooltip: {
				enabled: true,
	            shared: false,
                borderWidth: 0,
                backgroundColor:'rgba(255,255,255,0)',
                borderColor: 'rgba(255,255,255,0)',
                borderRadius: 0,
                shadow: false,
                useHTML: true,
                formatter: function () {
                    var ret = '<div class="lab-tooltip">';
                    ret += '<div>' + PointInTime.format(new Date(this.x)) + '</div>';
                    ret += '<div>' + this.series.name + ' <b>' + this.y + '</b> ';
                    if (this.point.displayInterpretationCode) {
                        ret += '<span class="label label-';
                        if (this.point.displayInterpretationCode.indexOf('*') != -1) {
                            ret += 'danger">';
                        } else {
                            ret += 'warning">';
                        }
                        ret += this.point.displayInterpretationCode + '</span>';
                    }
                    ret += ' ';
                    ret += this.point.units;
                    if (this.point.high && this.point.low) {
                        ret += '<span>&nbsp;[' + this.point.low + '-' + this.point.high + ']</span>';
                    }
                    ret += '</div>';
                    if (this.point.comment) {
                        ret += '<pre style="font-size: 10px;margin-top: 2px">' + this.point.comment + "</pre>";
                    }
                    ret += '</div>';
                    return ret;
                }
			},
    		plotOptions: {
        		line: {
        			dataLabels: {
        				enabled: true,
                        backgroundColor: 'rgba(255,255,255,0)',
                        borderWidth: 0,
                        borderRadius: 0,
                        useHTML: true,
        				formatter: function(){
        					var ret = '<div class="datalabel">' + this.y;
							if(this.point.displayInterpretationCode) {
								ret += ' <span class="label label-' + (this.point.displayInterpretationCode.indexOf('*') != -1 ? 'danger' : 'warning') +'">' +  this.point.displayInterpretationCode + "</span>";
							}
                            ret += '</div>';
							if (ret) return ret;
        				}
        			}
        		}
	        }
    	};
    	chartPanel.updateChart(chartData, chartCfg);
    },
    
    applyDetailItem: function(newItem, filterParams) {
    	var me = this;
    	
    	// error checking
        if (!newItem) {
            this.setTitle("");
            this.update('');
            return;
        }
        var uid = newItem.get('uid');

        // set the title
        var title = newItem.get('detailTitle');
        if (!title) {
        	title = newItem.get(this.getTitleProperty());
        }
        if (!title) {
        	title = 'Item Details';
        }
        this.setTitle(title);
        
        // fetch current filter data
        var params = this.up('searchpanel').getSearchParams();
        var term =   this.up('searchpanel').getSearchTerm();

        // which type of details: HTML/Graph/Grid
        var domain = newItem.get('type');
		var detailCfg = newItem.get('detailCfg');
        var detailType = newItem.get('detailType');
        if (!detailType && (domain == 'result' || domain == 'vital' || uid.indexOf("lab") != -1 || uid.indexOf("vital") != -1)) {
        	detailType = 'graph';
        }
        
        // update the details per type
        if (detailType == 'graph' && uid) {
        	// TODO: Somehow get the grouping of labs in here. Maybe return a custom XType?
        	// Need to dig deeper into the search results mechanism.
//            this.getLoader().load({ // For some reason, the component loader does not work consistently across browsers. This fails on IE10.
        								// However, Ext.Ajax.request works fine, so we'll use that.
        	this.update('');
            var myItem = newItem;
        	Ext.Ajax.request({
                url: '/vpr/trend/' + encodeURIComponent(uid),
                renderer: 'data',
                method: 'GET',
                params: {
                    format: 'json',
                    range: params.range
                },
                success: function(loader, response) {
                	var jsonResult = Ext.JSON.decode(loader.responseText);
                	if(jsonResult.data.currentItemCount==0) {
                        me.loader.url = '/vpr/detail/' + encodeURIComponent(uid);
                        me.loader.load();
                	} else {
                		if(!jsonResult) return;
                    	
                    	var chartData = [];
                    	chartData[0] = jsonResult.data;
                    	chartData[0].data = chartData[0].items;
                    	chartData[0].items=null;
                    	me.updateChartData(chartData);
                	}
                }
            });
        } else if (detailType == 'panelCfg') {
        	this.removeAll();
        	this.update('');
        	var detailCfg = newItem.get("detailCfg");
        	if(filterParams.range) {
        		detailCfg.viewParams.range = filterParams.range;
        	}
        	this.add(detailCfg);
        } else if (detailType == 'viewdef' && detailCfg && detailCfg.viewID) {
        	this.updateGrid(newItem);
        } else if (detailType == 'window') {
        	this.removeAll();
        	var cfg = newItem.get('detailCfg');
        	if (cfg && cfg.url) {
        		window.open(cfg.url);
        	}
        } else if (detailType == 'iframe') {
        	this.removeAll();
        	var cfg = newItem.get('detailCfg');
        	if (cfg && cfg.url) {
    			this.getLoader().getTarget().update('<iframe src="' + cfg.url + '" height="100%" width="100%" frameborder="1">', true);
        	}
        } else if (detailType == 'url') {
        	var detailCfg = newItem.get("detailCfg");
            this.getLoader().load({url:detailCfg.url, scripts: true});
        } else if (uid) {
      	    this.getLoader().load({
            	scripts: true,
                url: '/vpr/detail/' + encodeURIComponent(uid) + 
                	"?searchterm=" + encodeURIComponent(term)
            });
        } else {
        	this.update('Unable to fetch detail for this item.');
        }
    }
});