Ext.define('gov.va.cpe.viewdef.editors.ResultedOrdersEditor', {
	alias: 'widget.resultedordersdisplay',
	extend: 'Ext.panel.Panel',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [{
		xtype: 'panel',
		flex: 0,
		style: 'background-color: white;',
		layout: {
			type: 'hbox',
			align: 'stretch',
		},
		items: [{
			xtype: 'button',
			ui: 'link',
			iconCls: 'fa-times-circle',
			text: '<- Prev',
			flex: 0,
			handler: function(bn) {
				var editor = bn.up('resultedordersdisplay');
				editor.selDex = editor.selDex - 1;
				if(editor.selDex<0) {
					editor.selDex = editor.orders.length-1;
				}
				editor.refreshOrderDat();
			}
		},{
			xtype: 'displayfield',
			name: 'name',
            style:'text-align:center;',
			flex: 1
		},{
			xtype: 'button',
			ui: 'link',
			text: 'Next ->',
			flex: 0,
			handler: function(bn) {
				var editor = bn.up('resultedordersdisplay');
				editor.selDex = editor.selDex + 1;
				if(editor.selDex>(editor.orders.length-1)) {
					editor.selDex = 0;
				}
				editor.refreshOrderDat();
			}
		}]
	},{
		xtype: 'panel',
		flex: 1,
		html: 'Empty'
	}],
	orders: null,
	selDex: null,
	setValue: function(val) {
		if(Ext.isString(val)) {
			this.orders = Ext.decode(val).results;
		} else {
			this.orders = val.results;
		}
		this.selDex = this.orders?this.orders.length>0?0:-1:-1;
		this.refreshOrderDat();
	},
	refreshOrderDat: function() {
		if(this.selDex>-1) {
			var ord = this.orders[this.selDex];
			this.down('displayfield').setValue(ord.name);
			var detail = this.down('panel');
			if(ord.results && ord.results.length>0 && ord.results[0].result) {
				detail.html = ord.results[0].result.summary;
			} else {
				detail.html = "Not Resulted";
			}
		}
	},
	getValue: function() {},
	reset: function(a, b, c) {}
});