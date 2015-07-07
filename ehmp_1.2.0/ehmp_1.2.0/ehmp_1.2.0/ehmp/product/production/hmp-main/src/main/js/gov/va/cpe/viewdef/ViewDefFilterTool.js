
/**
 * This is a combo between toolbar, menu and button.  
 * 
 * TODO: would be nice to update the current menu's instead of re-creating them on each refresh.
 */
Ext.define('gov.va.cpe.viewdef.ViewDefFilterTool', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.viewdeffiltertool',
	
	// toolbar config
	enableOverflow: true,
	border: false,
	maxWidth: 300,
	defaults: {scale: 'small', ui: 'link'},
	
	// custom properties
	paramKeys: null, // if null, then all, otherwise an array of which params to generate menus for 
	datePickerOptions: {'T':'Today Only', '-1W': 'Past Week', '-1M': 'Past Month', '-1Y': 'Past Year', '-3Y': '3 Years'},
	
	listeners: {
		render: function() {
			var me = this;
			
			// bind the grid + store
			this.grid = this.up('viewdefgridpanel');
			if (!this.grid) return; // not attached to a gridpanel
			this.store = this.grid.getStore();
			this.store.on('metachange', function(store, meta) {
				me.buildMenuItems(meta.params || {}, me.grid);
			});
		}
	},
	
	// a function that knows how to get all the values from its menu/submenus.
	getMenuValues: function(menu, vals) {
		menu.items.each(function(item) {
			// if it has a submenu, delegate to a child getMenuValues
			if (item.menu && Ext.isFunction(item.menu.getMenuValues)) {
				vals = item.menu.getMenuValues(item.menu, vals);
			} else if (item.key) {

				if (item["boolean"] === true) {
					// boolean checkbox (not a multiple list)
					// TODO: should I look at item.group instead?
					vals[item.key] = item.checked;
				} else if (item.checked === true) {
					// checked items can be an array of values
					if (!Ext.isArray(vals[item.key])) {
						vals[item.key] = [];
					}
					
					var val = (typeof item.value === 'undefined') ? item.text : item.value;
					if (val != null) vals[item.key].push(val);
				} else if (Ext.isFunction(item.getValue)) {
					// regular form element
					vals[item.key] = item.getValue();
				}
			}
		});
		return vals;
	},
	
	addToolbarMenu: function(cfg) {
		this.add(Ext.merge(cfg, {menuAlign: 'tr-br?', listeners: {render: this.onBtnRender}}));
	},
	
	buildMenuItems: function(viewParams, grid) {
		var me = this;
		
		// remove any existing items
		me.removeAll();
		
    	// generate a menu based on the recognized parameters in the metadata
    	Ext.Array.each(viewParams, function(item) {
    		var key = item.key;
			var title = (item.title) ? item.title : key;
			var summary = 'Select';
			
			// skip if not specified
			if (!key || (me.paramKeys && !Ext.Array.contains(me.paramKeys, key))) return;
			
			var menu = Ext.create('Ext.menu.Menu');
			menu.on('click', me.onMenuClick, me);

    		if (item.clazz === 'gov.va.cpe.vpr.queryeng.ViewParam$BooleanParam') {
    			// A boolean param gets translated into a single checkbox menu item
    			var checked = item.defaults[key];
    			menu.add({xtype: 'menucheckitem', 'boolean': true, key: key, checked: checked, text: title});
    		} else if (item.clazz === 'gov.va.cpe.vpr.queryeng.ViewParam$ENUMParam') {
    			// enumerated list param builds a submenu with checkbox menu items
    			var curvals = item.values[key];
    			var group = (item.multiple === true) ? null : key;
    			var summarydisp = [];
    			
    			// loop though each possible ENUM value and add it
    			for (var i=0; i < item['enum'].length; i++) {
    				var val = txt = item['enum'][i];
    				var checked = Ext.Array.contains(curvals || [], txt);
    				if (item.displayVals && item.displayVals.length > i) txt = item.displayVals[i]; 
    				if (checked) summarydisp.push(txt);
    				menu.add({xtype: 'menucheckitem', checked: checked, group: group, key: key, value: val, text: txt});
    			}
    			
    			// add the all/default option
    			/*
    			menu.add('-');
    			menu.add({xtype: 'menucheckitem', checked: (curvals.length == 0), key: item.key, value: null, groupVal: null, text: 'All'});
    			*/
    			if (!summarydisp.length) summarydisp = ['All'];
    			if (summarydisp.length) summary = summarydisp.join(',');
    		} else if (item.clazz === 'gov.va.cpe.vpr.queryeng.ViewParam$NumRangeParam') {
    			var min = item.min || Number.NEGATIVE_INFINITY, max = item.max || Number.MAX_VALUE, val = item.values[item.key];
    			menu.add({xtype: 'numberfield', fieldLabel: title, labelWidth: 50, width: 20, key: item.key, value: val, minValue: min, maxValue: max});
    		} else if (item.clazz === 'gov.va.cpe.vpr.queryeng.ViewParam$DateRangeParam') {
    			var curvalkey = (item.values && item.key) ? item.values[item.key + '.orig'] : null;
    			for (var key in me.datePickerOptions) {
    				var txt = me.datePickerOptions[key.toUpperCase()];
    				var checked = (curvalkey == null) ? false : curvalkey.toUpperCase() == key.toUpperCase();
    				if (checked) summary = txt;
    				menu.add({xtype: 'menucheckitem', checked: checked, group: item.key, key: item.key, value: key, text: txt});
    			}
    		} else {
    			// not recognized.  Quit so we don't add any menu's
    			return;
    		}
    		
    		me.addToolbarMenu({prefix: title, text: summary, menu: menu});
//    		me.add({prefix: title, text: summary, menu: menu, menuAlign: 'tr-br?', listeners: {render: me.onBtnRender}});
    	});
	},
	
	onMenuClick: function(menu) {
		var vals = this.getMenuValues(menu, {});
		if (!this.grid) return; // not attached to a grid
		this.grid.setViewDef(this.grid.viewID, Ext.apply(this.grid.curViewParams, vals));
	},
	
	onBtnRender: function() {
		if (this.prefix) this.btnEl.insertSibling(this.prefix + ": ");
	}
	
});