Ext.define('gov.va.cpe.viewdef.editors.CWADGridDisplay', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.cwadgrid',
	requires: ['gov.va.cpe.viewdef.editors.CWADGridModel'],
	autoScroll: true,
	hideHeaders: false,
	store:{
        model:'gov.va.cpe.viewdef.editors.CWADGridModel',
        proxy: {
            type: 'memory',
            reader: {
                type: 'json'
            }
        },
        autoLoad:false
    },
    columns: [
        {
            text:'Name',
            dataIndex:'name',
            flex:1
        },
        {
        	text: 'Content',
        	dataIndex: 'content',
        	flex: 5
        }
    ],
    features: [{
    	ftype: 'rowbody',
        setupRowData: function(record, rowIndex, rowValues) {
            var headerCt = this.view.headerCt,
                colspan = headerCt.getColumnCount();
            return {
                rowBody: '<div><pre>'+record.get('content')+'</pre></div>',
                rowBodyCls: Ext.baseCSSPrefix + 'grid-row-body-hidden',
                rowBodyColspan: colspan
            };
        }
    }],
    setValue: function(val) {
    	var json = Ext.isString(val)?Ext.decode(val):val;
    	if(json && json.data) {
        	this.getStore().loadRawData(json.data);
    	}
    },
    initComponent: function() {
    	var me = this;
    	this.on('itemclick', function(grid, rec, item, index, e, eopts) {
    		var uid = rec.get('uid');
    		if(uid) {
    			Ext.Ajax.request({
        			url: '/detail/'+uid,
        			method: 'GET',
        			success: function(resp) {
        				me.updateDetail(resp.responseText, e);
        			}
        		})
    		} else {
    			me.updateDetail(rec.get('content'), e);
    		}
		});
    	this.callParent(arguments);
    },
    updateDetail: function(txt, clickEvt) {
    	if(!this.externalWidget) {
        	this.detail = {xtype: 'window', collapsible: false, constraintInsets: '10 10 10 10', /*constrainTo: pwnd, */constrain: true, closeAction: 'hide'};
    		this.externalWidget = Ext.widget(this.detail.xtype, this.detail);
    	}
		this.externalWidget.update(txt);
		var x = clickEvt.xy[0];
		var y = clickEvt.xy[1];
		this.externalWidget.showAt(x, y);
		this.externalWidget.doConstrain();

		this.up('pceditwrapper').externalWidget = this.externalWidget;
    }
});