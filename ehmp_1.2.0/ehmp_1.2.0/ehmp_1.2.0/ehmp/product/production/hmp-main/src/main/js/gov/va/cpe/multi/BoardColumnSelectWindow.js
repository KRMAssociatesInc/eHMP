Ext.define('gov.va.cpe.multi.BoardColumnSelectWindow', {
	extend: 'Ext.window.Window',
	title: 'Add / Edit Column',
	id: 'boardColSelectWnd',
	alias: 'widget.boardColumnSelectWindow',
	requires: ['gov.va.cpe.multi.BoardColumnOption'],
	width: 500,
	height: 700,
	target: null, // Target to which I will call addColumn(gov.va.cpe.multi.BoardColumn col)
	title: 'Add Column',
	layout: {type: 'hbox', align: 'stretch'},
	items: [{
		xtype: 'grid',
		padding: '20 20 20 20',
		id: 'boardColEditWndViewDefGrid',
		store: {
			model: 'gov.va.cpe.multi.BoardColumnOption',
			proxy: {
				type: 'ajax',
				url: '/config/column/list',
				reader: {
					type: 'json'
				}
			}
		},
		flex: 1,
		selModel: {
			mode: "MULTI"
		},
		columns: [
		          {text: 'Name', dataIndex: 'name', flex: 1},
		          {text: 'Description', dataIndex: 'description', flex: 3}
		]
	}],
	submitSelected: function() {
		var sel = this.down('grid').getSelectionModel().getSelection();
		if(this.target && Ext.isFunction(this.target.addColumn) && sel) {
			for(key in sel) {
				this.target.addColumn(sel[key]);
			}
		}
		this.close();
	},
	initComponent: function() {
		this.callParent(arguments);
		this.down('grid').on('selectionchange', this.submitSelected, this);
	},
    onBoxReady:function() {
        this.callParent(arguments);
        this.down('grid').getStore().load();
    }
});