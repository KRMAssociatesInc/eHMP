Ext.define('gov.va.cpe.viewdef.editors.AcuityEditor', {
	alias: 'widget.acuity',
	extend: 'Ext.panel.Panel',
	height: 210,
	minWidth: 100,
	layout: 'border',
	items: [{
		xtype: 'form',
		region: 'center',
		layout: {type: 'vbox', align: 'stretch'},
		items: [{
			xtype: 'radiogroup',
			style: 'font-size: 10px;',
			listeners: {
				change: function(bn, newval, oldval, eOpts) {
					bn.up('pceditwrapper').collapse();
				}
			},
			defaults: {
				flex: 1,
				xtype: 'radiofield',
				name: 'acuity'
			},
			columns: 1,
			vertical: true,
			items: [{
				boxLabel: '1',
				inputValue: '1'
			},{
				boxLabel: '2',
				inputValue: '2'
			},{
				boxLabel: '3',
				inputValue: '3'
			},{
				boxLabel: '4',
				inputValue: '4'
			},{
				boxLabel: '5',
				inputValue: '5'
			}]
		}]
	}],
	reset: function(a, b, c) {
		this.down('form').getForm().reset();
	},
	setValue: function(val) {
		var json = val;
		if(!Ext.isObject(val)) {
			json = Ext.decode(val, true) || {};
		}
		if(json && json.data && json.data.length>0) {
			json = json.data[0];
		}
		this.down('form').getForm().reset();
		this.down('form').getForm().setValues(json);
		this.srcJson = json;
	},
	getValue: function() {
		var vals = this.down('form').getForm().getValues();
		if(this.srcJson && this.srcJson.uid) {
			vals.uid = this.srcJson.uid;
		}
		return vals;
	},
	isValid: function() {
		return true;
	}
});