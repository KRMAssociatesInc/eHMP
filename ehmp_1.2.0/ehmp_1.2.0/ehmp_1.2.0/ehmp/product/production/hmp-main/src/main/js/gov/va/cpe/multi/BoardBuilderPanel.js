Ext.define('gov.va.cpe.multi.BoardBuilderPanel', {
    extend:'Ext.container.Container',
    itemId:'mpePanel',
    requires:[
        'gov.va.cpe.viewdef.BoardGridPanel',
        'gov.va.cpe.roster.RosterStore',
        'gov.va.cpe.multi.BoardColumnEditor',
        'gov.va.cpe.multi.Board',
        'gov.va.cpe.multi.BoardPreviewWindow'
    ],
    alias:'widget.boardEditor',
    layout: 'border',
    width: '100%',
    height: '100%',
    items:[
        {
        	collapsible: true,
        	collapsed: false,
        	collapseMode: 'header',
        	region: 'west',
            title:'&nbsp;',
        	width: 300,
            xtype:'grid',
            ui: 'well',
            frame: true,
            id:'mpeGrid',
            itemId:'boardList',
            region:'west',
            split: true,
            title:'Boards',
            columns:[
                {text:'Name', dataIndex:'name', width:200, flex: 1},
                {text:'Draft', dataIndex:'draft', width:50, 
                    renderer: function(val) {
                    	if(val) {
                    		return '<span class="fa fa-pencil"/>';
                    	}
                    	return "";
                    }
                },
                {
                    xtype:'actioncolumn',
                    width:20,
                    items:[
                        {
                            iconCls: 'fa fa-remove-sign',
                            tooltip:'Remove Board'
                        }
                    ]
                }
            ],
            tools: [
                {
                    xtype:'button',
                    ui:'link',
                    text:'New Board',
                    itemId: 'createBoardButton'
                }
            ]
        },
        {
            hidden: true,
            itemId: 'boardForm',
            region: 'center',
            xtype: 'panel',
            width: 300,
            layout: {type: 'hbox', align: 'stretch'},
            items: [{
            	xtype: 'panel', 
            	layout: {type: 'vbox', align: 'stretch'},
            	items: [{
                            flex: 0,
                            xtype: 'textfield',
                            itemId: 'boardName',
                            fieldLabel: 'Name',
                            emptyText: 'Board Name',
                            maxLength: 96,
                            enforceMaxLength: true
                        },
                        {
                            flex: 0,
                            xtype: 'displayfield',
                            itemId: 'ownerName',
                            fieldLabel: 'Created By',
                            name: 'ownerName'
                        },
                        {
                            flex: 0,
                            xtype: 'textarea',
                            itemId: 'boardDescription',
                            fieldLabel: 'Description',
                            name: 'description',
                            emptyText: 'Description'
                        },
                        {
                        	flex: 0,
                        	xtype: 'combobox',
                        	fieldLabel: 'Cohort Filter',
                        	itemId: 'boardCohortField',
                        	name: 'cohort',
                        	queryMode: 'local',
                        	store: [
                    	        ['','None'],
                    	        ['gov.va.cpe.vpr.queryeng.CohortFilterQuery.AlertPatientCohort', 'Drug Intervention Candidates'],
                    	        ['gov.va.cpe.vpr.queryeng.CohortFilterQuery.HighA1CPatientCohort', 'Patients w/ Abnormal A1C']
                	        ]
                        },                        
                        {
                            flex: 0,
                            xtype: 'tagfield',
                            itemId: 'boardCategoriesField',
                            fieldLabel: 'Categories',
                            name: 'categories',
                            idField: 'uid',
                            nameField: 'name',
                            descField: 'description',
                            store: {
                                model: 'gov.va.cpe.multi.BoardCategory',
                                proxy: {
                                    type: 'ajax',
                                    url: '/category/list',
                                    extraParams: {
                                        domain: 'board'
                                    },
                                    reader: {
                                        type: 'json',
                                        root: 'data.items',
                                        totalProperty: 'data.totalItems'
                                    }
                                }
                            },
                            addPickerChoice: function (val, success, failure) {
                                var me = this;
                                var successFn = success;
                                var failureFn = failure;
                                var wnd = Ext.create('Ext.window.Window', {
                                    title: 'Add New Category',
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'form',
                                            layout: {type: 'vbox', align: 'stretch'},
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    name: 'name',
                                                    fieldLabel: 'Name',
                                                    value: val
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    name: 'description',
                                                    fieldLabel: 'Description'
                                                }
                                            ]
                                        }
                                    ],
                                    bbar: {
                                        items: [
                                            {
                                                xtype: 'button',
                                                text: 'Submit',
                                                handler: function (bn) {
                                                    bn.disable();
                                                    var wnd = bn.up('window');
                                                    var frm = wnd.down('form');
                                                    var vals = frm.getForm().getValues();
                                                    Ext.apply(vals, {domain: 'board'});
                                                    Ext.Ajax.request({
                                                        url: "/category/new",
                                                        method: 'POST',
                                                        jsonData: vals,
                                                        success: function (response) {
                                                            successFn(response);
                                                            wnd.close();
                                                        },
                                                        failure: function (response) {
                                                            failureFn(response);
                                                            wnd.close();
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                });
                                wnd.setWidth(300);
                                wnd.setHeight(180);
                                wnd.show();
                            }
                        },{
                        	xtype: 'grid',
                            itemId: 'boardColumnList',
                            id: 'boardColumnList',
                            title: 'Columns',
//                            region: 'west',
                            flex: 1,
                            autoScroll: true,
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
                                                var srcgrid = grid.up('#boardColumnList');
                                                var rec = grid.getStore().removeAt(rowIndex);
                                                srcgrid.fireEvent('colremove', this, rec);
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
                            removeSelectedColumn: function () {
                                var sel = this.getSelectionModel().getSelection();
                                var grid = this;
                                if (sel != null && sel.length > 0) {
                                    var col = sel[0];
                                    this.getStore().remove(col);
                                    this.fireEvent('colremove', this, col);
                                }
                            }
                        }]
            	},{
                        xtype: 'boardcoloptions',
                        id: 'boardcoloptionpanel',
                        region: 'center',
                        hidden: true,
                        autoScroll: true
            	}],
            tools: [
                {
                    xtype: 'button',
                    text: 'Discard Changes',
                    ui: 'link',
                    disabled: true
                },
                {
                    xtype: 'button',
                    text: 'Remove',
                    ui: 'link',
                    itemId: 'removeBoardButton'
                },
                {
                    xtype: 'button',
                    text: 'Save',
                    itemId: 'saveBoardButton'
                }
            ]
        }, {
        	xtype: 'panel',
        	region: 'south',
        	height: '40%',
            src: null,
//            title: 'Panel Preview',
            layout: {type: 'vbox'},
            items: [{
            	flex: 0,
            	width: '100%',
            	html: '<hr class="hmp-waffer-thin">'
            },{
//                padding: '5 5 5 5',
                flex: 0,
                xtype: 'combobox',
                itemId: 'mpeRosterPicker',
                queryMode: 'local',
                queryParam: 'filter',
                grow: true,
                fieldLabel: 'Preview Roster',
                emptyText: '<Select Patient List for Board Preview>',
                typeAhead: true,
                allowBlank: false,
                forceSelection: true,
                displayField: 'name',
                valueField: 'uid',
                minWidth: 400,
                hidden: true
            },{
            	flex: 1,
            	width: '100%',
            	xtype: 'panel',
            	layout: 'fit', 
            	items: [{
            		xtype: 'boardgridpanel',
                    id: 'boardPreviewPanel',
                    forceFit: true,
                    addFilterTool: true,
                    reconfigureColumnsAlways: true,
                    proxyBaseUrl: '/vpr/board/',
                    loader: {
                    	loadMask: false
                    }
            	}]
            }]
        }
    ],
    onAddColumn: function(grid, col) {
    	var newSeq = 1;
    	var blist = this.down('#boardColumnList');
    	blist.getStore().data.each(function(item, index, length) {
            newSeq = (newSeq>item.get('sequence'))?newSeq:item.get('sequence')+1;
        });
        col.set('sequence',newSeq);
        blist.getStore().add(col);
        blist.getSelectionModel().select(col);
        blist.fireEvent('coladd', this, col);
    },
    initEvents:function() {
        this.callParent(arguments);
        this.mon(this.down('boardColumnAddButton'), 'select', this.onAddColumn, this);
    },
    onBoxReady: function() {
        var boardStore = Ext.data.StoreManager.containsKey('boardsdraft') ? Ext.getStore('boardsdraft') : Ext.create('gov.va.cpe.multi.BoardStore',{
            storeId: 'boardsdraft',
            model: 'gov.va.cpe.multi.Board',
            proxy: {
                type: 'ajax',
                url: '/config/panels',
                reader: {
                    type: 'json'
                },
                extraParams: {
                    showDraft: true
                }
            }
        });

        this.down('#boardList').bindStore(boardStore);
        boardStore.load();

        var store = Ext.getStore('rosters');
        if(store==null) {
            store = Ext.create('gov.va.cpe.roster.RosterStore');
            store.load();
        }
        this.down('#mpeRosterPicker').bindStore(store);
        this.down('#boardColumnList').addEvents(
            'colchange',
            'coladd',
            'colremove'
        );
    }
});