Ext.define('gov.va.cpe.viewdef.editors.PatientLocationEditor', {
	requires: ['gov.va.cpe.viewdef.editors.PointOfCareEditor',
	           'gov.va.cpe.viewdef.editors.PointOfCareForm'],
	alias: 'widget.location',
	extend: 'Ext.panel.Panel',
	minWidth: 300,
	height: 80,
	layout: 'border',
	items: [{
		xtype: 'form',
		region: 'center',
		layout: {type: 'vbox', align: 'stretch'},
		items: [{
			xtype: 'panel',
			layout: {type: 'hbox', align: 'stretch'},
			items: [{
				xtype: 'pocedit',
				fieldLabel: 'Location',
				name: 'pocUid',
			},{
				xtype: 'button',
				text: 'Add',
				handler: function(bn){
					var pnl = this.up('panel');
					var store = pnl.down('pocedit').getStore();
					var wnd = Ext.create('Ext.window.Window', {
						title: 'New Point of Care',
						layout: 'border',
						height: 100,
						width: 200,
						items: [{
							xtype: 'pocform'
						}]
					});
					wnd.down('form').getForm().on('actioncomplete', function(a, b, c){
						store.load();
						wnd.close();
					}) 
					this.up('location').externalWidget = wnd;
					wnd.show();
				}
			}]
		}]
	}],
	reset: function(a, b, c) {
		this.down('form').getForm().reset();
	},
	setValue: function(val) {
		var json = val;
		if(!Ext.isObject(val)) {
			json = Ext.decode(val);
		}
		if(json.data && json.data.length>0) {
			json = json.data[0];
		}
		this.down('form').getForm().reset();
		this.down('form').getForm().setValues(json);
		this.srcJson = json;
	},
	getValue: function() {
		// Get full blown location object from location UID to send to back-end
		var vals = this.down('form').getForm().getValues();
		if(vals.pocUid) {
			var store = this.down('pocedit').getStore();
			store.each(function(rec){
				if(rec.get('uid')==vals.pocUid) {
					vals.location = rec.data;
				}
			});
		}
		
		if(this.srcJson && this.srcJson.uid) {
			vals.uid = this.srcJson.uid;
		}
		return vals;
	},
	isValid: function() {
		return true;
	}
});