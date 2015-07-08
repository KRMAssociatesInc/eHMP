Ext.define('gov.va.cpe.designer.PanelEditor', {
	extend: 'Ext.container.Container',
	title: 'Default Editor',
	setEditorValues: function(vals) {
	},
	getEditorValues: function() {
	},
	statics: {
		parseObjToDot: function(cfg) {
			var ret = {};
			for (var key in cfg) {
				var newkey = key;
				var value = cfg[key];
				if (Ext.isObject(value)) {
					newkey += '.';
					for (var subkey in value) {
						ret[newkey + subkey] = value[subkey];
					}
				} else {
					ret[key] = value;
				}
			}
			
			return ret;
		},
	    parseDotToObj: function(cfg) {
	    	// any property that starts with detail. rearange into the object higherarcy
	    	var ret = {};
	    	for (var key in cfg) {
	    		var idx = key.indexOf('.');
	    		var val = cfg[key];
	    		if (idx > 0) {
	    			var prefix =  key.substr(0, idx);
	    			var newkey = key.substr(idx+1);
	    			if (!ret[prefix]) {
	    				ret[prefix] = {}
	    			}
	    			ret[prefix][newkey] = val; 
	    		} else {
	    			ret[key] = val;
	    		}
	    	}
	    	return ret;
	    }
	},
	items: [
	    {xtype: 'textfield', name: 'title', fieldLabel: 'Name/Title'},
    ]
});

/**
 * Simple shared store that currently just lists all the available ViewDefs.
 */
Ext.create('Ext.data.Store', {
	storeId: 'ViewDefStoreID',
	fields: ['code','name'],
	proxy: {
		type: 'ajax',
		url: '/app/list?type=gov.va.cpe.viewdef',
		reader: {
			root: 'items',
			type: 'json'
		}
	}    
});

Ext.define('gov.va.cpe.designer.DataGridDetail', {
	extend: 'Ext.tab.Panel',
	preview: false, // live preview mode?
	
	initComponent: function() {
		this.callParent();
		var me = this;
		
		this.form = Ext.create('Ext.form.Basic', this);
		
		// attach a special handler to the viewID field, to reload metadata
		this.down('#viewID').on('change', function(fld, newVal, oldVal) {
			if (!newVal) {
				return;
			}
			// load the view metadata
			me.disable();
			Ext.Ajax.request({
				url: '/view/meta',
				params: {view: newVal},
				success: function(resp) {
					var meta = Ext.JSON.decode(resp.responseText);
					me.configure(meta);
					me.enable();
				}
			})
		});
	},
	
	configure: function(meta) {
		var me = this;
		
		// remove any existing event handlers before we update the tabs/fields
		var fields = me.query('field');
		for (var i in fields) {
			var fld = fields[i];
			fld.un('change', me.onFormUpdate, me);
		}
		
		// load the columns into the columns tab
//		if (meta.columns) {
//			this.colstore.removeAll();
//			this.colstore.add(meta.columns);
//		}
		
		// load the detail fields into the detail selector
		if (meta.defaults['view.details']) {
			var details = meta.defaults['view.details'];
			var detailcombo = me.down('combobox[name="detailField"]');
			detailcombo.getStore().removeAll(true);
			for (var i in details) {
				detailcombo.getStore().add({field1: details[i]});
			}
		}
		
//		// loop through the params, anything that is not recognized gets added to misc
//		if (meta.params) {
//			var misctab = me.down('#MiscTabID');
//			misctab.removeAll(true);
//			misctab.disable();
//			
//			// first remove anything currently on the panel
//			
//			// TODO: how to incorporate some sort of view advisor JS object here?
//			
//			// then add any fields to it that we can infer from metadata
//			for (var i in meta.params) {
//				var param = meta.params[i];
//				if (param.defaults && param.enum && param.clazz == "gov.va.cpe.vpr.queryeng.ViewParam$ENUMParam") {
//					for (var key in param.defaults) {
//						var val = param.defaults[key];
//						misctab.add({xtype: 'combobox', name: 'viewParams.' + key, fieldLabel: key, value: val, store: param.enum})
//						misctab.enable();
//					}
//				}
//			}
//		}
		
		// attach form field change listeners
		var fields = me.query('field');
		for (var i in fields) {
			var fld = fields[i];
			fld.on('change', me.onFormUpdate, me, {buffer: 500});
		}
	},
	
	setEditorValues: function(vals) {
		var v = gov.va.cpe.designer.PanelEditor.parseObjToDot(vals);
 		this.form.setValues(v);
 		var dt = vals.detailType;
 		
 		if(vals.detailType!="") {
 			var box = this.down("#detailtypecombobox");
 			var dtlpnl = this.down("#detailpanelconfig");
 			var opts = box.getStore().collect(box.displayField);
 			if(!Ext.Array.contains(opts,dt)) {
 				dtlpnl.disable();
 			}
 		}
	},
	
	getEditorValues: function() {
		// first inject all the form values (and convert to a nested map)
		var ret = gov.va.cpe.designer.PanelEditor.parseDotToObj(this.form.getFieldValues());
		
		// also collect the column list/orders
//		var disp = '';
//		for (var i=0; i < this.colstore.getCount(); i++) {
//			var rec = this.colstore.getAt(i);
//			if (rec.get('required') === true || rec.get('hidden') === false) {
//				disp += rec.get('dataIndex') + ","
//			}
//		}
//		if (!ret['viewParams']) { 
//			ret['viewParams'] = {} 
//		}
//		ret['viewParams']['col.display'] = disp;
		
//		if (ret['viewParams'].sort == '' || !ret['viewParams'].sort) {
//			delete ret['viewParams'].sort;
//		}
//		if (ret['viewParams'].group == '' || !ret['viewParams'].group) {
//			delete ret['viewParams'].group;
//		}
		
		// return results
		return ret;
	},

	onFormUpdate: function() {
		// if the form is valid, then gather all the values up into their appropriate places
		// 1) component config data, 2) view params, 3) etc.
		if (this.form && this.form.isValid() && this.preview) {
			var vals = this.getEditorValues();
			this.generatePreview(vals.pid, vals);
		}
	},
	
	generatePreview: function(pid, vals) {
		var me = this;
		
		// if the previewpanel does not exist, create it
		// there is some really strange issue here where including this as a docked item by default
		// causes an error the second time a DataGridDetail is created.  Very strange.
        if (!this.previewpanel) {
        	this.previewpanel = Ext.create('Ext.panel.Panel', {
            	dock: 'bottom',
            	resizable: true, resizeHandles: 'n',
            	minHeight: 200, height: 300,
            	title: 'Live Preview',
            	layout: 'fit'
            })
        	this.addDocked(this.previewpanel);
        	
        	// resize handler to get the layout to work
        	this.previewpanel.on('resize', function(comp, width, height, eOpts) {
        		me.forceComponentLayout();
        	});
        }
		
		// first remove any existing previews
		this.previewpanel.removeAll(true);
		
		// construct the config we are going to pass in
		var cfg = Ext.merge(vals, {margin: 5, viewAutoLoad: true, viewParams: {'patient.id': pid, 'patient_id': pid, 'pid': pid}})
		
		var grid = Ext.create('gov.va.cpe.viewdef.ViewDefGridPanel', cfg);
		this.previewpanel.add(grid);
	},
	
	defaults: {
		padding: 5,
	},
	items: [
        {
        	title: 'General',
        	layout: 'hbox',
			minHeight: 200,
			defaults: {
				margin: '0 5 0 0',
			},
        	items: [
            		{
            			xtype: 'fieldset', 
            			title: 'Display',
            			items: [
    	   	                {
    		                	xtype: 'textfield',
    		                	name: 'title',
    		                	fieldLabel: 'Name/Title',
    		                	qtip: 'Displayed before any data is loaded, or if no Title Template is defined.',
    		                	allowBlank: false,
    		                },
    	   	                {
    		                	xtype: 'textfield',
    		                	name: 'titleTpl',
    		                	fieldLabel: 'Title Template',
    		                	qtip: 'Only displayed after data is loaded, may contain {fromRecord}, {toRecord}, {total}',
    		                },
    	   	                {
    		                	xtype: 'textfield',
    		                	name: 'tabConfig.tooltip',
    		                	fieldLabel: 'Tooltip',
    		                	qtip: 'Displayed when the mouse is hovered over the tab',
    		                },
        				    {
    		                	xtype: 'combobox', 
    		                	name: 'viewID',
    		                	itemId: 'viewID',
    		                	allowBlank: false,
    		                	fieldLabel: 'View Def',
    		                	valueField: 'code',
    		                	displayField: 'name',
    		                	store: 'ViewDefStoreID',
    		                	queryMode: 'local',
    		                	listConfig: {
    		                		minWidth: 500
    		                	},
                                listeners: {
                                    boxready:function(combo) {
                                        combo.getStore().load();
                                    }
                                }
    		                },
       	                ]
            		},
            		{
            			xtype: 'fieldset',
            			title: 'Display Options',
            			items: [
							{id: 'collapsechkbox', xtype: 'checkbox', inputValue: true, name: 'collapsible', boxLabel: 'Collapsible'},
							{id: 'collapsewhenemptychkbox', xtype: 'checkbox', inputValue: true, name: 'collapseGridIfEmpty', boxLabel: 'Automatically collapse if no data?'},
        				    {xtype: 'checkbox', inputValue: true, name: 'hideHeaders', boxLabel: 'Hide column headers'}
           			    ]
            		}
	        ]
		}, 
		{
			xtype: 'fieldcontainer',
			title: 'Detail Options',
			id: 'detailpanelconfig',
			layout: 'hbox',
			minHeight: 200,
			defaults: {
				margin: '0 5 0 0',
			},
			items: [{
				xtype: 'fieldset',
				title: 'Detail Options',
				items: [
				        /*
				         * Find this store and populate it with whatever shared detail panels (existing independently in the owner-container) exist.
				         */
				    {xtype: 'combobox', id: 'detailtypecombobox', name: 'detailType', fieldLabel: 'Detail Panel Loc', forceSelection: true, allowBlank: false, value: 'none', store: ['bottom','right','rowbody','window','tip','tooltip','shared','none']},
				    {xtype: 'checkbox', inputValue: true, name: 'detail.resizable', boxLabel: 'Resizable?'},
				    {xtype: 'checkbox', inputValue: true, name: 'detail.collapsible', boxLabel: 'Collapsible?'},
				    {xtype: 'checkbox', inputValue: true, name: 'detail.autoCollapse', boxLabel: 'Automatically collapse when there is no data'}
				    // TODO: titleTpl/titleField/emptyHTML?
		        ]
			},{
				xtype: 'fieldset',
				title: 'Other',
				items: [
				    {xtype: 'combobox', name: 'detailField', fieldLabel: 'Detail Field', disabled: true, queryMode: 'local', store: []},
				    {xtype: 'combobox', name: 'detailTitle', fieldLabel: 'Detail Title', disabled: true, store: ['observed', 'summary', 'uid','etc']},
			        {xtype: 'numberfield', name: 'detail.height', fieldLabel: 'Height'},
			        {xtype: 'numberfield', name: 'detail.width', fieldLabel: 'Width'}
		        ]
			}]
		},
		{
			xtype: 'fieldset',
			title: 'Toolbars',
			minHeight: 300,
			items: [        				    
			    {xtype: 'combobox', name: 'tbarConfig', fieldLabel: 'Top Toolbar', 
			    	store: [
		    	        ['','None'],
		    	        ['gov.va.cpe.viewdef.AutoFilterToolbar','Filter Toolbar'],
		    	        ['Ext.toolbar.Paging','Paging Toolbar']
		    	    ]},
			    {xtype: 'combobox', name: 'bbarConfig', fieldLabel: 'Bottom Toolbar',
			    	store: [
			    	        ['','None'],
			    	        ['Ext.toolbar.Paging','Paging Toolbar']
		    	    ]}
		    ]
		}/*,
		{
			title: 'Misc',
			itemId: 'MiscTabID'
		}*/
    ]
});
