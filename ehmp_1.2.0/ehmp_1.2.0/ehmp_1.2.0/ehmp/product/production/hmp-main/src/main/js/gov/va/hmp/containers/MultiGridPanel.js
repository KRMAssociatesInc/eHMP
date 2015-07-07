/*
 * The idea here is to have a detail pane 'baked' into the panel, and allow 2+ other components to
 * share the detail pane.  Layout could be either horizonal or vertical. 
 */
Ext.define('gov.va.hmp.containers.MultiGridPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.multigridpanel',
	layout: {type: 'vbox', align: 'stretch', padding: '0 0 6 0'},
//    bodyPadding: 3,
	border: 0,
	stateful: false,
	detail: {},
	defaults: function(config) {
//		config.padding = '0 6 0 0';
		if (this.layout.type == 'hbox') {
			// the first item gets no left padding, the rest do.
//			config.padding = '0 0 6 6';
			if (this.items.length == 0) {
				config.padding = '0 6 0 0';
			}
		}

		// this only works for items dynamically added to the panel after
		// inital creation/rendering.
		if (this.detailCmp && config.setDetailPanel) {
			config.setDetailPanel(this.detailCmp);
		}
	},
	initComponent: function() {
		var me = this;
		this.callParent();

		// tools may also be rendered as menu items in some cases, so use the icon/text elements as well.
		// cant use the addTools() method because we need this data intact prior to render.
		this.tools = [{
			type: 'expand',
			icon: '/images/icons/ic_plus.png',
			tooltip: 'Add Item',
			text: 'Add Item',
			handler: function() {
				// TODO: how to make this a menu/selection of different things to add?
				me.add({xtype: 'viewdefgridpanel', title: 'New Item', html: 'Click Edit...'});
			}
		}];

		// detail could be a itemId reference, or a config object
		if (Ext.isString(this.detail)) {
			this.detailCmp = this.query(this.detail);
			this.detailCmp = this.detailCmp.length ? this.detailCmp[0] : null;
		} else {
			Ext.applyIf(this.detail, {xtype: 'griddetailpanel', dock: (this.layout.type == 'vbox') ? 'right' : 'bottom'});
			this.detailCmp = this.addDocked(this.detail)[0];
		}

		// must initalize each grid
		this.items.each(function() {
			if (this.isXType('viewdefgridpanel')) {
				// TODO: Issue: if the gridpanel is actually in a nested component (another container for instance) then this
				// doesn't work.
				// This also turns out to be somewhat redundant with the panels setDetailPanel(selector) anyway.
				this.setDetailPanel(me.detailCmp);
			}
		});

	},
    onBoxReady:function() {
        var me = this;
//        Ext.log(Ext.getClassName(this) + ".onBoxReady()");
        me.callParent(arguments);

        // TODO: temporary, should probably be ported to its own panel soon
        if (this.conditionReview) {
            this.items.get(0).on('select', function() {
                var grid = me.items.get(1);
                var vals = {'filter_class': 'ANTIVIRALS,BETA BLOCKERS/RELATED'};
                grid.setViewDef(grid.curViewID, Ext.apply(grid.curViewParams, vals));
            });
        }
    },
	getStateForPanel: function(panel) {
		if(panel.xtype=='panel' || panel.xtype=='container')
		{
			if(panel.items && panel.items.length>0)
			{	
				var state = {
						xtype: panel.xtype, 
						items: [], 
						flex: panel.flex, 
						layout: {
							type: panel.layout.type, 
							align: panel.layout.align
						}
				};
				for(key in panel.items.items)
				{
					state.items[key] = this.getStateForPanel(panel.items.items[key]);
				}	
			}
		}
		else if(panel.xtype=='griddetailpanel')
		{
			var state = {
					xtype: panel.xtype,
					itemId: panel.itemId,
					height: panel.height,
					collapsible: panel.collapsible,
					autoCollapse: panel.autoCollapse,
					flex: panel.flex
			}
		}
		else if(Ext.isFunction(panel.getState))
		{
			return panel.getState();
		}
		else
		{
			console.log("UNKNOWN ITEM: "+panel.xtype);
		}
	},

	getState: function() {
		var me = this, state = {xtype: 'multigridpanel', title: this.title, detail: this.detail, items: []};
		for (var i=0; i < me.items.length; i++) {
			var panel = me.items.get(i);

			state.items[i] = this.getStateForPanel(panel);//.getState();
		}
		return state;
	},
});
