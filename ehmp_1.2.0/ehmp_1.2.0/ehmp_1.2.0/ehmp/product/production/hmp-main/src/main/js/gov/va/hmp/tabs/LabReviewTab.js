/**
 * Known outstanding issues:
 * TODO: The header rows are selectable, how can we make them unselectable like group header row?
 * 
 */
Ext.define('gov.va.hmp.tabs.LabReviewTab', {
	extend: 'gov.va.hmp.containers.OnePanelToRuleThemAll',
    requires: ['gov.va.cpe.viewdef.TrendChartDetailPanel',
        'gov.va.hmp.util.HL7DTMFormatter',
        'gov.va.cpe.patient.PatientAwareTab'],
    mixins: {
        patientawaretab: 'gov.va.cpe.patient.PatientAwareTab'
    },
	alias: 'widget.labreviewtab',
	title: 'Lab Review',
	detail: 'none',
	tbar: {height: 32, style: 'background-color: yellow; text-align: center; width: 100%;', xtype: 'component', 
		html: '<img src="/images/icons/under_construction_32.png" style="float: left"/>This area is under construction...<img src="/images/icons/under_construction_32.png" style="float: right;"/> '},
	items: [
        {
        	xtype: 'viewdefgridpanel', 
        	gridX: 0,
        	gridY: 0,
        	widthX: 1,
        	widthY: 2,
        	weightX: 1,
        	weightY: 2,
        	title: 'Lab Summary',
        	itemId: 'labresultssgrid',
        	viewID: 'gov.va.cpe.vpr.queryeng.LabProfileViewDef',
        	viewParams: {group: 'group', 'row.count': 1000},
        	tools: [{xtype: 'viewdeffiltertool', paramKeys: ['range', 'filter.profiles']}],
        	hideHeaders: true,
        	groupHeaderTpl: "{name}",
        	selType: 'rowmodel',
        	selModel: {
        		mode: "SIMPLE"
        	},
        	addFilterTool: true,
        	reconfigureColumnsAlways: true,
//        	extraColumns: [{xtype: 'flagcolumn'}],
        	listeners: {
        		// TODO: This toggle menu isn't ready for primetime yet.
        		beforerenderXXX: function() {
        			var me = this;
        			var cfg = {xtype: 'button', ui: 'link', text: 'View Mode', menu: {listeners: {}, items: []}}
        			cfg.menu.items.push({text: 'Chronological Accession View', viewdef: 'gov.va.cpe.vpr.queryeng.LabViewDef', viewParams: {group: 'accessionId', groupHeaderTpl: "{[values.children[0].data.specimen]} (Collected: {[PointInTime.format(values.children[0].data.observed)]})"}});
        			cfg.menu.items.push({text: 'Worksheet Profile View', viewdef: 'gov.va.cpe.vpr.queryeng.LabProfileViewDef', viewParams: {group: 'group', 'row.count': 100}});
        			cfg.menu.listeners.click = function(menu, item) {
        				me.setViewDef(item.viewdef, item.viewParams);
    				};
        			this.tools.push(cfg);
        		},
        		itemclick: function(model, rec) {
        			if (rec.get('pk') == rec.get('group')) {
        				// header row, not sure if this is the best way to identify it
        				return false;
        			}
        			
        			// collapse the orders grid so the details grid is full height
        			var ordersgrid = this.up().down('#labordersgrid');
        			if(ordersgrid && ordersgrid.collapsible)
        			{
        				ordersgrid.collapse();
        			}
        		}
        	}
    	},
    	{
    		xtype: 'viewdefgridpanel', 
    		gridX: 1,
    		gridY: 0,
    		widthX: 1,
    		widthY: 1,
    		weightX: 1,
    		weightY: 1,
    		itemId: 'labordersgrid',
    		title: 'Tests Ordered',
    		titleTpl: 'Tests Ordered ({total})',
			tools: [
                {xtype: 'button', ui: 'link', text: 'New Order', handler: function() { alert('Not Implemented Yet');}},
                {xtype: 'tbspacer',width:6}
            ],
            detailType: '#labgriddetailpanel',
//			extraColumns: [{xtype: 'flagcolumn'}],
            viewID: 'gov.va.cpe.vpr.queryeng.OrdersViewDef',
            viewParams: {filter_group: 'CH,MI,LAB','col.display': 'Summary,Status,start,providerDisplayName,Facility'}
		},
		{
			xtype: 'trendchartdetailpanel',
			itemId: 'labgriddetailpanel',
    		gridX: 1,
    		gridY: 1,
    		widthX: 1,
    		widthY: 1,
    		weightX: 1,
    		weightY: 1,
			listeners: {
				boxready: function(cmp) {
					var me = cmp;
					// TODO: this isn't the best way to get a reference to the grid....
					var labgrid = cmp.up('labreviewtab').down('#labresultssgrid');
					me.chartCfg.plotOptions = {
		        		line: {
		        			dataLabels: {
		        				enabled: true, 
		        				backgroundColor: 'rgba(255,0,0,0.7)',
			        			color: 'rgba(255,255,255,0.7)',
		        				formatter: function(){
									if(this.point.interpreted) {
										return this.point.interpreted;
									}
		        				}
		        			}
		        		}
			        };

					labgrid.on('selectionchange', function(model, recs) {
						me.selNames = [];
						me.selCodes = [];
						for (var i=0; i < recs.length; i++) {
							var name = recs[i].data.name;
							me.selCodes.push(recs[i].data.typeCode);
							if(name) {me.selNames.push(i+'^'+name);}
						}
						var viewParams = {'view':'gov.va.cpe.vpr.queryeng.LabTrendViewDef','filter_typeCodes': me.selCodes.join(','), 'pid': labgrid.pid};
						me.updateChart(me.chartCfg, viewParams, 'gov.va.cpe.vpr.queryeng.LabTrendViewDef', function(store, records, success, operation, eopts) {
							var chartData = [];
							/*
							 * TODO: In the case we have the same name with different units of measure,
							 * we should create a separate set for the other unit of measure. 
							 */
							for(nameId in me.selNames)
							{
								var name = me.selNames[nameId].split('^')[1];
								var id = me.selNames[nameId].split('^')[0];
								var cdat = {'name': name, 'type':'line', data: []};
								for(datId in records) {
									var dat = records[datId].data;
									if(dat[id] && dat[id+'_units'])
									{
										cdat['name'] = name + ' ('+dat[id + '_units']+')';
										me.chartCfg.yAxis = {title: {text: dat[id + '_units']}};
										var datapoint = {};
										datapoint['y'] = dat[id];
										datapoint['x'] = gov.va.hmp.util.HL7DTMFormatter.UTC(dat['observed']);
										datapoint['interpreted'] = dat[id+'_interpret'];
										cdat.data.push(datapoint);
									}
								}
								chartData.push(cdat);
							}
							if(store.chartPanel) {
								store.chartPanel.updateChart(chartData, me.chartCfg);
							}
						});
					});
				}
			}
    	}
    ],
    getState: function() {
    	return {
	    	xtype: 'labreviewtab',
	    	title: 'Lab Review'
    	}
    } ,

    enablePatientAware: function() {
        this.setPatientAware(true);
    },

    disablePatientAware: function() {
        this.setPatientAware(false);
    },

    setPatientAware: function(flag) {
        this.setPatientAwareForTabViewDef(this.items.items[0], flag);
        this.setPatientAwareForTabViewDef(this.items.items[1], flag);
        var labgriddetailpanel = this.items.items[2];
        this.setPatientAwareForTabViewDef( labgriddetailpanel.items.items[1], flag);
    },

    setPatientAwareForTabViewDef: function (item, flag) {
        if (typeof(item.patientAware) !== 'undefined') {
            item.patientAware = flag;
            if (flag) {
                if (item.pid != 0 && item.pid != gov.va.hmp.PatientContext.pid) {
                    item.pid = gov.va.hmp.PatientContext.pid;
                    item.reload();
                }
            }
        }
    }
});

