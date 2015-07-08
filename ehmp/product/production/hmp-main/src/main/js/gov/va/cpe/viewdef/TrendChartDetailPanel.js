Ext.define('gov.va.cpe.viewdef.TrendChartDetailPanel', {
	extend: 'gov.va.cpe.viewdef.GridDetailPanel',
	alias: 'widget.trendchartdetailpanel',
	
	updateChart: function(chartCfg, viewParams, viewID, graphStoreHandler) {
		this.remove(this.items.get(2), true);
		var grid = this.down('viewdefgridpanel');
		var cfg = this.chartCfg;
		cfg.width = this.width;
		cfg.height = this.height;
		var chartPanel = this.add(cfg);
		var newParams = Ext.apply(grid.curViewParams || {}, viewParams);
		grid.setViewDef(viewID || grid.viewID, newParams, true, graphStoreHandler);
		grid.getStore().chartPanel = chartPanel;
		this.setCard(2);
	},
	
	toggleHandler: function(btn, e) {
		btn.up('trendchartdetailpanel').setCard(btn.cardIdx || 0);
		e.stopEvent();
	},
	
	items: [{xtype: 'container',tag:'detail'},
	        {xtype: 'viewdefgridpanel', tag:'labTrend', viewID: 'gov.va.cpe.vpr.queryeng.LabTrendViewDef'},
	        {xtype: 'container', tag:'labTrend'}],

	tools: [{xtype: 'button', enableToggle: true, toggleGroup: 'card', cardIdx: 0, tooltip: 'Detail', handler: this.toggleHandler, icon: '/images/icons/text_align_justify.png', pressed: true},
			{xtype: 'button', enableToggle: true, toggleGroup: 'card', cardIdx: 1, tooltip: 'Table/Trend',  handler: this.toggleHandler, icon: '/images/icons/table.png'},
			{xtype: 'button', enableToggle: true, toggleGroup: 'card', cardIdx: 2, tooltip: 'Chart/Graph', handler: this.toggleHandler, icon: '/images/icons/chart_line.png'}],
	
});