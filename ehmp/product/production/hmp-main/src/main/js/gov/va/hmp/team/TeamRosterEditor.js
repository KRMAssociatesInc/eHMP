/**
 * this is a private inner grid for the roster window
 * @private
 */
Ext.define('gov.va.hmp.team.TeamRosterEditor', {
    extend: 'Ext.grid.Panel',
    requires: ['gov.va.hmp.team.RosterSourceMultiBox'],
    alias: 'widget.teamrostereditor',
//    height: 225,
    enableColumnHide: false,
    enableColumnMove: false,
    enableColumnResize: false,
    selType: 'cellmodel',
    tools:[
        {
            xtype:'button',
            ui: 'link',
            text: 'Add Patient',
            handler: function(btn) {
                var grid = btn.up('teamrostereditor');
                grid.addRow(grid, grid.getStore().data.length)
            }
        }
    ],
    store: Ext.create('Ext.data.Store', {
        fields: ['seq', 'source', 'name', 'localId', 'operation'],
        autoLoad: false
    }),
    viewConfig: {
    	plugins: ['gridviewdragdrop']
    },
    listeners: {
    	edit: function (editor, e, eOpts) {
            if (e.column.text == 'Value') {
            	 // the ID field: store both the displayField and valueField
                var editor = e.column.getEditor();
                e.record.set('localId', e.value);
                e.record.set('name', editor.lastDisplay);
                var me = editor.up('teamrostereditor');
                me.fireEvent('patientchange', this, e.record);
            }
        },
        beforeedit: function (editor, e, eOpts) {
        	if(e.column.text == 'Value') {
        		this.valueStoreHack.proxy.extraParams = {
        			id: e.record.get('source')
        		};
        	}
        }
    },
    columns: [
        {
            header: 'Patient',
            itemId: 'valueColumn',
            dataIndex: 'name',
            menuDisabled: true,
            sortable: false,
            flex: 1,
            editor: {
            	xtype: 'rostersourcemultibox'
        /*      xtype: 'combobox',
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
                    select: function (combo, recs) {
                        // both the displayField and valueField must end up in the edited record
                        // this seems like the only way I can figure to get access to the displayField later.
                        combo.lastDisplay = recs[0].data.name;
                    }
                }*/
            }
        },
        {
            header: 'Source',
            itemId: 'sourceColumn',
            dataIndex: 'source',
            menuDisabled: true,
            sortable: false,
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
                        {name: 'Clinic', value: 'Clinic'},
                        {name: 'Ward', value: 'Ward'},
                        {name: 'OE/RR', value: 'OE/RR'},
                        {name: 'PCMM Team', value: 'PCMM Team'},
                        {name: 'Provider', value: 'Provider'},
                        {name: 'Reminder List', value: 'PXRM'},
                        {name: 'Specialty', value: 'Specialty'},
                        {name: 'Patient', value: 'Patient'},
                        {name: 'VPR Roster', value: 'VPR Roster'}
                    ]
                })
            },
            flex: 0
        },
        {
            xtype: 'actioncolumn',
            flex: 0,
            width: 20,
            menuDisabled: true, sortable: false,
            items: [
                {iconCls: 'fa-times-circle', tooltip: 'Delete Row', handler: function (grid, rowIdx, colIdx) {
                	if(grid.xtype!='teamrostereditor' && grid.ownerCt.xtype=='teamrostereditor') {
                		grid = grid.ownerCt;
                	}
                    grid.removeRow(grid, rowIdx)
                }}
            ]
        }
    ],
    addRow: function(grid, rowIdx) {
        grid.getStore().insert(rowIdx, {localId:0, source:'Patient', name:'Type to search...', operation:'UNION'});
    }, 
    removeRow:function (grid, rowIdx) {
        if (grid.getStore().getCount() > 1) {
            // dont allow removing the last row
            var rec = grid.getStore().removeAt(rowIdx);
            grid.fireEvent('patientremove', this, rec);
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
            fields: ['name', 'localId'],
            proxy: {
                type: 'ajax',
                url: '/roster/source',
//                extraParams: {
//                    id: 'Patient'
//                },
                reader: {
                    root: 'data',
                    type: 'json'
                }
            }
        });
        this.valueStoreHack = sourceStore;
        this.columns[0].editor.store = sourceStore;
        var me = this;
        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                listeners: {
                	edit: function(editor, e) {
                        var srcgrid = me.up('#rosterWindowSrcGrid');
                        if(srcgrid) {
                            srcgrid.fireEvent('edit', me, null);
                        }
                	}
                }
            })
        ];
        this.callParent(arguments);

        this.addEvents(
                'patientchange',
                'patientremove'
            );

    },
    onBoxReady: function() {
    	this.callParent(arguments);
    	if(this.getStore().data.length==0) {
        	this.addRow(this, 0);
    	}
    }
});