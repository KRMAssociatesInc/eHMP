/*
 * TODO: getState() support. The users will certainly want these filter buttons to remember. (the Alamo!)
 */
Ext.define('gov.va.cpe.viewdef.AutoFilterToolbar', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.autofiltertbar',
	layout: 'auto',
	configure: function(data) {
		var me = this;
		if (data.metaData && data.metaData.params) {
			for (var i in data.metaData.params) {
				var param = data.metaData.params[i];
				
				if (param["enum"] && param.clazz === 'gov.va.cpe.vpr.queryeng.ViewParam$QuickFilterParam') {
					for (var j in param["enum"]) {
						var et = true;
						if(this.grid.viewParams && this.grid.viewParams[param.key])
						{
							if(this.grid.viewParams[param.key].indexOf(param["enum"][j])==-1)
							{
								et = false;
							}	
						}	
						
						// get the display value (if any), default to the code
						var text = param["enum"][j];
						if (param.displayVals && Ext.isArray(param.displayVals) && param.displayVals.length >= j) {
							text = param.displayVals[j];
						}
						this.add({
							xtype: 'button',
                            ui: 'pill',
							filterCode: param["enum"][j],
							text: text,
							pressed: et, // All ON (included) by default. Blank columns = confused users = more bug reports.
							key: param.key,
							enableToggle: true,
							handler: function(bn, evt) {
								me.refreshBasedOnPressedButtons();
							}
						});
					}
				}
			}
		}
		this.refreshBasedOnPressedButtons();
	},
	
	refreshBasedOnPressedButtons: function()
	{
		var fltrs = {};
		for(var i = 0; i < this.items.length; i++)
		{
			var bn = this.items.items[i];
			if(bn.xtype == 'button')
			{
				if(!fltrs[bn.key])
				{
					/*
					 * An empty value gets ignored and doesn't go thru to the filter, so....
					 */
					fltrs[bn.key] = ['zzzzzz'];
					/*
					 * ....because, intuitively, no buttons selected should return no values.
					 */
				}
				if(bn.pressed)
				{
					fltrs[bn.key].push(bn.filterCode);
				}	
			}
		}
		this.grid.setViewDef(this.grid.curViewID, Ext.apply(this.grid.curViewParams, fltrs));
	},
	
	bindGrid: function(grid) {
		var me = this;
		this.grid = grid;
		this.store = grid.store;
		
		// when the store is loaded, grab the metadata and create/configure the toolbar.
		// only needs to run once since the grid would be recreated if the viewdef were changed
		this.store.on('datachanged', function(store) { me.configure(store.proxy.reader.rawData)}, this, {single: true});
	}
	
});