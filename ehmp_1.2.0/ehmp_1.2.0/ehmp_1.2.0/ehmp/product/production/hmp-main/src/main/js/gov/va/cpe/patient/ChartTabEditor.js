Ext.define('gov.va.cpe.patient.ChartTabEditor', {
	extend: 'Ext.window.Window',
	alias: 'widget.pteditor',
	height: 500,
	width: 800,
	title: 'Custom View Editor',
	layout: 'fit',
	tbar: {
		layout: {type: 'hbox', align: 'stretch'},
		items: [{
			flex: 1,
			xtype: 'container',
			items: [{
		        xtype: 'radiogroup',
		        fieldLabel: 'Page Type',
		        // Arrange radio buttons into two columns, distributed vertically
		        columns: 1,
		        vertical: true,
		        items: [
		            { 
		            	boxLabel: 'Grid Detail', name: 'rb', inputValue: {
		            	xtype: 'viewdefgridpanel', title: 'New Item', html: 'Click Edit...', detailType: 'right', tbarConfig: [{
		        			type: 'gear',
		        			icon: '/images/icons/cog_edit.png',
		        			tooltip: 'Edit Page',
		        			text: 'Edit Page',
		        			handler: function(cmp) {
		        				var win = Ext.create('gov.va.hmp.containers.WidgetTabPanelEditWin');
		        				win.configure(cmp.up('viewdefgridpanel'));
		        				win.show();
		        			}	
		            	}]
		            }},
		            { 
		            	disabled: true, boxLabel: 'Dynamic Table', name: 'rb', inputValue: {
		            	xtype: 'wunderpanel'
		            }},
		            { 
		            	disabled: true, boxLabel: 'Web Page', name: 'rb', inputValue: {
		            	xtype: 'panel'
		            }}
		        ]
			}],
		},{
			xtype: 'form',
			flex: 1,
			items: [{
				xtype: 'textfield',
				fieldLabel: 'Name',
				name: 'name'
			},{
				xtype: 'combo',
				fieldLabel: 'Category',
				name: 'category',
				queryMode: 'local',
				displayField: 'category',
				valueField: 'category',
				emptyText: 'Select or Add',
				allowBlank: false,
				store: Ext.create('Ext.data.Store', {
					model: 'gov.va.cpe.patient.TabCategory',
					proxy: {
						type: 'ajax',
						reader: {
							type: 'json'
						}
					}
				})
			}]
		},
		{
			flex: 0,
			xtype: 'button',
			text: 'Add Panel',
			menu: {
				plain: true,
                bodyPadding: 4,
                layout: 'vbox',
                defaultType: 'container',
                defaults: {
                    xtype: 'button',
                    flex: 1
                },
                items: [{
                	text: 'Grid',
                	handler: function(cmp) {
                		// TODO: Add grid panel.
                		Ext.MessageBox.alert('Add Panel','Add Grid Panel (TODO)');
                	}
                },{
                	text: 'Detail',
                	handler: function(cmp) {
                		// TODO: Add detail panel.
                		Ext.MessageBox.alert('Add Panel','Add Detail Panel (TODO)');
                	}
                }]
			}
		}]
	},
	fbar: [
        {
			xtype: 'button',
			text: 'Save',
			handler: function(cmp) {
				cmp.up('pteditor').submitNewTab();
			}
		}
    ],
	doAddGrid: function() {
		
	},
	doAddDetail: function() {
		
	},
	onBoxReady: function() {
		this.callParent(arguments);
		this.down('radiogroup').on('change', function(cmp, newval, oldval) {
			var pnl = cmp.up('pteditor');
			pnl.removeAll();
			var addCmp = pnl.insert(0, newval.rb);
			if(newval.rb.xtype && newval.rb.xtype=='viewdefgridpanel') {
				// Show vdgp config dialog
				var win = Ext.create('gov.va.hmp.containers.WidgetTabPanelEditWin');
				win.configure(addCmp);
				win.show();
			}
		});
		if(this.target) {
			var vals = this.target.getCategoryNames();
			this.down('combo').getStore().loadRawData(vals);
		}
	},
	submitNewTab: function() {
		var me = this;
		if(this.items.length>0) {
			var tabDef = this.items.items[0].getState();
			var frm = me.down('form');
			if(frm.isValid()) {
				var vals = frm.getForm().getValues();
				Ext.apply(vals,{widget: tabDef});
				Ext.Ajax.request({
					url: '/page/add',
					method: 'POST',
					params: {
						tabJson: Ext.encode(vals)
					},
					success: function(response) {
						if(me.target) {
							me.target.addTabOption(Ext.decode(response.responseText), true);
						}
						me.close();
					}
				})
			} else {
				Ext.MessageBox.alert('Cannot Save','A Category must be selected.');
			}
		} else {
			Ext.MessageBox.alert('Cannot Save','No component has been added.');
		}
	}
});