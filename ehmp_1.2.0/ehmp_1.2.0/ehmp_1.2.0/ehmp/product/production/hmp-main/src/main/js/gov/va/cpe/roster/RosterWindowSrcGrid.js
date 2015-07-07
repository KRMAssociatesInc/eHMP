/**
 * this is a private inner grid for the roster window
 * @private
 */
Ext.define('gov.va.cpe.roster.RosterWindowSrcGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rosterwindowsrcgrid',
    height: 225,
    enableColumnHide: false,
    enableColumnMove: false,
    enableColumnResize: false,
    selType: 'cellmodel',
    store: Ext.create('Ext.data.Store', {
        fields: ['sequence', 'source', 'name', 'localId', 'action'],
        autoLoad: false
    }),
    columns: [
//        {
//            xtype: 'actioncolumn',
//            itemId: 'rowMoveColumn',
//            width: 45,
//            menuDisabled: true,
//            sortable: false,
//            items: [
//                {iconCls: 'upBtn', tooltip: 'Move Up', handler: function (grid, rowIdx, colIdx) {
//                	if(grid.xtype!='rosterwindowsrcgrid' && grid.ownerCt.xtype=='rosterwindowsrcgrid') {
//                		grid = grid.ownerCt;
//                	}
//                	grid.moveRow(grid, rowIdx, -1)
//                }},
//                {iconCls: 'downBtn', tooltip: 'Move Down', handler: function (grid, rowIdx, colIdx) {
//                	if(grid.xtype!='rosterwindowsrcgrid' && grid.ownerCt.xtype=='rosterwindowsrcgrid') {
//                		grid = grid.ownerCt;
//                	}
//                    grid.moveRow(grid, rowIdx, 1)
//                }}
//            ]
//        },
        {
            header: 'Type',
            itemId: 'typeColumn',
            width: 75,
            dataIndex: 'source',
            menuDisabled: true,
            sortable: false,
            renderer: function(value) {
            	if(value=='patient') {
            		return 'Patient';
            	}
            },
            editor: {
                xtype: 'combobox',
                defaultListConfig: {minWidth: 200},
                forceSelection: true,
                queryMode: 'local',
                allowBlank: false,
                displayField: 'name',
                valueField: 'value',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'Clinic', value: 'clinic'},
                        {name: 'Ward', value: 'ward'},
                        {name: 'OE/RR', value: 'oe/rr'},
                        {name: 'PCMM Team', value: 'pcmm'},
                        {name: 'Provider', value: 'provider'},
                        {name: 'Reminder List', value: 'pxrm'},
                        {name: 'Specialty', value: 'specialty'},
                        {name: 'Patient', value: 'patient'},
                        {name: 'VPR Roster', value: 'vpr roster'}
                    ]
                })
            }
        },
        {
            header: 'Value',
            itemId: 'valueColumn',
            dataIndex: 'name',
            menuDisabled: true,
            sortable: false,
            flex: 1,
            editor: {
                xtype: 'combobox',
                allowBlank: false,
                displayField: 'name',
                valueField: 'id',
                hideTrigger: true,
                listConfig: {
                    minHeight: 50,
                    emptyText: 'No matching records found...',
                    loadingText: 'Searching....'
                },
                emptyText: 'Select a value...',
                forceSelection: true,
                queryParam: 'filter',
                minChars: 4,
                queryMode: 'remote',
                listeners: {
                    focus: function (combo, e) {
                        var type = combo.getStore().getProxy().extraParams.id;
                        if (type === 'Patient') {
                            combo.minChars = 4;
                        } else {
                            combo.minChars = 0;
                        }
                    },
                    select: function (combo, recs) {
                        // both the displayField and valueField must end up in the edited record
                        // this seems like the only way I can figure to get access to the displayField later.
                        combo.lastDisplay = recs[0].data.name;
                    }
                }
            }
        },
//        {
//            header: 'Operation',
//            width: 60,
//            dataIndex: 'action',
//            menuDisabled: true,
//            sortable: false,
//            renderer: function (val) {
//                if (val == 'Union') {
//                    return 'Include';
//                } else if (val == 'Difference') {
//                    return 'Exclude';
//                }
//                return val;
//            },
//            editor: {
//                xtype: 'combobox',
//                defaultListConfig: {minWidth: 200},
//                queryMode: 'local',
//                allowBlank: false,
//                forceSelection: true,
//                displayField: 'name',
//                valueField: 'value',
//                store: Ext.create('Ext.data.Store', {
//                    fields: ['name', 'value'],
//                    data: [
//                        {name: 'Include (Union)', value: 'Union'},
//                        //{name: 'Intersection', value: 'Intersection'}, // Too advanced for now?
//                        {name: 'Exclude (Difference)', value: 'Difference'}
//                    ]
//                })
//            }
//        },
//        {
//            xtype: 'actioncolumn',
//            width: 45,
//            menuDisabled: true, sortable: false,
//            items: [
//                {iconCls: 'insertBtn', tooltip: 'Insert Row', handler: function (grid, rowIdx, colIdx) {
//                	if(grid.xtype!='rosterwindowsrcgrid' && grid.ownerCt.xtype=='rosterwindowsrcgrid') {
//                		grid = grid.ownerCt;
//                	}
//                    grid.addRow(grid, rowIdx + 1)
//                }},
//                {iconCls: 'deleteBtn', tooltip: 'Delete Row', handler: function (grid, rowIdx, colIdx) {
//                	if(grid.xtype!='rosterwindowsrcgrid' && grid.ownerCt.xtype=='rosterwindowsrcgrid') {
//                		grid = grid.ownerCt;
//                	}
//                    grid.removeRow(grid, rowIdx)
//                }}
//            ]
//        }
    ],
    addRow: function(grid, rowIdx) {
        grid.getStore().insert(rowIdx, {id:0, type:'Patient', name:'Type to search...', operation:'Union'});
    }, 
    removeRow:function (grid, rowIdx) {
        if (grid.getStore().getCount() > 1) {
            // dont allow removing the last row
            grid.getStore().removeAt(rowIdx);
        }
    },
    moveRow:function (grid, rowIdx, pos) {
        var store = grid.getStore();
        var rec = store.getAt(rowIdx);

        // bounds checking
        if (!rec || (rowIdx + pos) < 0 || (rowIdx + pos) >= store.getCount()) {
            return;
        }

        // ok to move
        store.removeAt(rowIdx);
        store.insert(rowIdx + pos, rec);

        // TODO: enable/disable buttons?
    },
    initComponent: function () {
        var sourceStore = Ext.create('Ext.data.Store', {
            fields: ['name', 'id'],
            proxy: {
                type: 'ajax',
                url: '/roster/source',
                extraParams: {
                    id: 'Patient'
                },
                reader: {
                    root: 'data',
                    type: 'json'
                }
            }
        });
//        this.columns[2].editor.store = sourceStore;
        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners: {
                    beforeedit: function (editing, event) {
                        var rec = event.record,
                            type = rec.get('type');
                        if (event.column.itemId === 'valueColumn') {
                            sourceStore.getProxy().extraParams.id = type;
                        }
                    }
                }
            })
        ];

        this.callParent(arguments);
    },
    onBoxReady: function() {
    	this.callParent(arguments);
    	if(this.getStore().data.length==0) {
        	this.addRow(this, 0);
    	}
    }
});