Ext.define('gov.va.hmp.admin.FrameListPanel', {
    extend:'gov.va.cpe.viewdef.ViewDefGridPanel',
    itemId:'frame-list',
    title:'Frames',
    titleTpl: 'Frames <span class="badge badge-info">{total}</span>',
    viewParams: {
        'group': 'type'
    },
    columns: [
 		{dataIndex: "id", text: 'ID (Name)', width: 300, flex: 1, xtype: 'templatecolumn',
 			tpl: '{id} <tpl if="id != name"> ({name})</tpl>'},
 		{dataIndex: 'class', text: 'Implementation Class', width: 250, hidden: true},
 		{
 			text: 'Runtime (ms)', 
 			columns: [
 			    {dataIndex: 'runCount', text: '#', width: 40},
	            {dataIndex: 'runMin', text: 'Min', width: 40},
	            {dataIndex: 'runMax', text: 'Max', width: 40},
	            {dataIndex: 'runAvg', text: 'Avg', width: 40},
	            {dataIndex: 'runSum', text: 'Sum', width: 40}
            ]
 		},
    ],
    viewID:'gov.va.cpe.vpr.queryeng.FrameListViewDef',
    detailType: 'bottom',
    detailTitleTpl:'{name}',
    detail: {
    	minHeight: '500'
    },
    tools: [
        {
        	xtype: 'textfield',
        	fieldLabel: 'Filter',
        	itemId: 'filterFieldID'
        		
        },{
            xtype:'button',
            itemId: 'refreshBtnID',
            ui: 'warning',
            text:'Refresh'
        }
    ],
    scroll: 'vertical',
    patientAware:false,
    viewConfig:{
        emptyText:'Loading Frames...',
        deferEmptyText:false
    },
    autorefresh:function () {
        var me = this,
            selectionModel = me.getSelectionModel();
        if (!selectionModel.hasSelection()) {
            me.getStore().load();
        } else {
            var selectionIds = Ext.Array.map(selectionModel.getSelection(), function (record) {
                return record.getId();
            });
            me.getStore().load(function (records, operation, success) {
                if (!success) return;
                var selectedRecords = Ext.Array.map(selectionIds, function (id) {
                    return me.getStore().getById(id);
                });
                selectionModel.select(selectedRecords);
            });
        }
    },
    listeners: {
    	afterRender: function() {
    		var me = this;
            this.down('#refreshBtnID').on('click', function() {
            	me.getStore().load();
            });
            this.down('#filterFieldID').on('change', function(btn, newstr, oldstr) {
            	var cfg = {};
            	if (newstr) cfg.filter = newstr;
            	console.log('cfg', cfg);
            	me.reload(cfg, null, true);
            });
    	}
    }
});