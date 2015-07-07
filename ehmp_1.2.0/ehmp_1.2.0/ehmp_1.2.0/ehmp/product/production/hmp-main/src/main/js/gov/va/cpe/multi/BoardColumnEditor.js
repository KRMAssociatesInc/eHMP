Ext.define('gov.va.cpe.multi.BoardColumnEditor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.boardColumnEditor',
    requires: [
        'gov.va.cpe.multi.BoardColumn',
        'gov.va.cpe.multi.BoardColumnOptionsEditor',
        'gov.va.cpe.multi.BoardColumnAddButton'
    ],
    layout: {type: 'border'},
    width: 200,
    id: 'mpeColPanelEditor',
    items: [
        {
            xtype: 'grid',
            itemId: 'boardColumnList',
            id: 'mpColGrid',
            title: 'Columns',
            region: 'west',
            split: true,
            width: 200,
            store: {
                model: 'gov.va.cpe.multi.BoardColumn',
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
                    }
                }
            },
            columns: [
                {
                    text: 'Column Title',
                    dataIndex: 'fieldName',
                    flex: 1
                },
                {
                    xtype: 'actioncolumn',
                    width: 20,
                    items: [
                        {
                            iconCls: 'fa-remove-sign',
                            tooltip: 'Remove Column',
                            handler: function (grid, rowIndex, colIndex) {
                                var srcgrid = grid;
                                var me = grid.up('boardColumnEditor');
                                var rec = grid.getStore().removeAt(rowIndex);
                                me.fireEvent('colremove', this, rec);
                            }
                        }
                    ]
                }
            ],
            tools: [
                {
                    xtype: 'boardColumnAddButton'
                }
            ],
            listeners: {
                selectionchange: {
                    fn: function (selMdl, selData, eOpts) {
                        var optPnl = this.up('boardColumnEditor').down('#boardcoloptionpanel');
                        if (selData.length > 0) {
                            var cd = selData[0].data.appInfo.code;
                            var id = selData[0].data.id;
                            if (cd) {
                                Ext.Ajax.request({
                                    url: '/config/getColumnConfigOptions',
                                    method: 'GET',
                                    params: {code: cd},
                                    success: function (response, opts) {
                                        optPnl.colEditor = this.up('boardColumnEditor');
                                        optPnl.columnClass = cd;
                                        optPnl.columnId = id;
                                        optPnl.setConfigOptions(Ext.decode(response.responseText));
                                        optPnl.setConfigData(selData[0]);
                                        optPnl.show();
                                    },
                                    failure: function (response, opts) {},
                                    scope: this
                                });
                            }
                        } else {
                            optPnl.hide();
                        }
                    }
                }
            },
            removeSelectedColumn: function () {
                var sel = this.getSelectionModel().getSelection();
                var grid = this;
                if (sel != null && sel.length > 0) {
                    var col = sel[0];
                    this.getStore().remove(col);
                    this.fireEvent('colremove', this, col);
                }
            }
        },
        {
            xtype: 'boardcoloptions',
            id: 'boardcoloptionpanel',
            region: 'center',
            hidden: true
        }
    ],
    setColumns: function (cols) {
        this.down('grid').getStore().loadData(cols);
    },
    getColumns: function () {
        return this.down('grid').getStore().data;
    },
    addColumn: function (col) {
        // Set to highest sequence; Store.size() can fail if lower-count column was removed
        var newSeq = 1;
        this.down('grid').getStore().data.each(function(item, index, length) {
            newSeq = (newSeq>item.get('sequence'))?newSeq:item.get('sequence')+1;
        });
        col.set('sequence',newSeq);
        this.down('grid').getStore().add(col);
        this.down('grid').getSelectionModel().select(col);
        this.fireEvent('coladd', this, col);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        var grid = this.down('grid');
        Ext.create('Ext.util.KeyMap', grid.getEl().dom, [
            {
                key: Ext.EventObject.DELETE,
                fn: function () {
                    grid.removeSelectedColumn();
                }
            },
            {

            }
        ]);
    },
    initComponent: function () {
        this.callParent(arguments);
        this.addEvents(
            'colchange',
            'coladd',
            'colremove'
        );
    },
    initEvents:function() {
        this.callParent(arguments);
        this.mon(this.down('boardColumnAddButton'), 'select', this.onSelectColumn, this);
    },
    onSelectColumn:function(grid, columnrec) {
        this.addColumn(columnrec);
    }
});