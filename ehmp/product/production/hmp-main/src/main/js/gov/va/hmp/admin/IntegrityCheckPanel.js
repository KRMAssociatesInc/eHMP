Ext.define('gov.va.hmp.admin.IntegrityCheckPanel', {
	extend: 'Ext.grid.Panel',
	flex: 1,
	title: 'JSON Data Integrity Check',
	alias: 'widget.jsondataintegritycheck',
	store: Ext.create('Ext.data.Store', {
		storeId: 'integrityCheckStore',
		fields: ['error','class','resolutions'],
		proxy: {
			type: 'ajax',
			url: '/integritycheck',
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		autoLoad: false
	}),
	columns: [
	    {text:'Error', dataIndex:'error', flex: 1},
	    {text:'Class', dataIndex:'class', flex: 1},
	    {text:'Resolution',dataIndex:'resolutions', flex: 2, renderer: function(value) {
	    	if(Ext.isString(value) && !value=="") {
	    		value = Ext.decode(value);
	    	}
	    	var rslt = "";
	    	for(key in value) {
	    		var val = value[key];
	    		if(val && val.display && val.hashcode) {
	    			if(key>0) {rslt += "<br>";}
	    			rslt += "<a href='javascript:;' onmousedown='gov.va.hmp.admin.IntegrityCheckPanel.doRes("+val.hashcode+")'>"+val.display+"</a>";
	    		}
	    	}
	    	return rslt=""?"<None Available>":rslt;
	    }}
	],
	onBoxReady: function() {
		this.callParent(arguments);
		this.store.load();
	},
	statics: {
		doRes: function(hashcode) {
			Ext.Ajax.request({
				url: '/integritycheck/resolve',
				method: 'POST',
				'hashcode':hashcode,
				params: {
					'hashcode':hashcode
				},
				success: function(resp) {
					
				},
				failure: function(resp) {
					
				}
			})
		}
	}
});