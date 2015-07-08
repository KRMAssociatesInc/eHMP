Ext.define('gov.va.hmp.admin.StatsPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'gov.va.hmp.EventBus'
    ],
    itemId: 'stats',
    alias: 'widget.statspanel',
    title: 'Stats',
    store: Ext.create('Ext.data.Store', {
        storeId: 'statsStore',
        fields: ['name', 'value','detailRestEndpoint', 'columns'],
        proxy: {
            type: 'ajax',
            url: '/sync/stats',
            extraParams: {
                format: 'json'
            },
            reader: {
                type: 'json',
                root: 'data.items'
            }
        }
    }),
    columns: [
        { header: 'Name', dataIndex: 'name', width: 200},
        { header: 'Value', dataIndex: 'value', flex: 1},
        { header: '', width: 160,
            renderer:function(value, metaData, record, rowIndex, colIndex, store, view) {
                if (record.get('name') === 'Sync Errors') {
                    return '<div class="btn btn-warning btn-xs" onclick="gov.va.hmp.EventBus.fireEvent(\'clearsyncerrors\')">Clear All Sync Errors</div>';
                } else {
                    return '';
                }
            }
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [
                {
                    xtype: 'button',
                    ui: 'danger',
                    itemId: 'cancelPending',
                    text: 'Cancel Pending Work'
                },
                '->',
                {
                    xtype: 'button',
                    itemId: 'autoUpdateToggle',
                    text: 'Disable Automatic Updates'
                }
            ]
        }
    ],
    onBoxReady: function() {
    	this.callParent(arguments);
    	this.on('selectionchange',function(selmdl) {
    		var selrec = selmdl.getSelection()[0];
    		if(selrec != null) {
        		if(selrec.get('detailRestEndpoint')!=null && selrec.get('columns')!=null) {
        			var rd = selrec.get('detailRestEndpoint');
                    var cols = [];//selrec.get('columns');
                    var colSpecs = selrec.get('columns');
                    var wdth = 20;
                    for(var key in colSpecs) {
                        var colSpec = colSpecs[key];
                        cols.push({header: colSpec, dataIndex: colSpec, width: 200})
                        wdth = wdth + 200;
                    }
        			var wnd = Ext.create('Ext.window.Window', {
            			layout: 'border',
            			width: wdth,
            			height: 400,
            			items: [{
            				region: 'center',
            				xtype: 'grid',
            			    store: Ext.create('Ext.data.Store', {
            			        fields: colSpecs,
            			        proxy: {
            			            type: 'ajax',
            			            url: rd
            			        }
            			    }),
            			    columns: cols
            			}]
            		});
        			wnd.down('grid').getStore().load();
        			wnd.show();
        		}
    		}
    		
    	});
    }
});