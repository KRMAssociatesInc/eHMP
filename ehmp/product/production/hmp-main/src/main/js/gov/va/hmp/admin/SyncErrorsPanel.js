Ext.define('gov.va.hmp.admin.SyncErrorsPanel', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.admin.SyncErrorStore'
    ],
    alias: 'widget.syncerrorspanel',
    itemId:'sync-errors',
    layout:{
        type:'border'
//        align:'stretch'
    },
    items:[
        {
            region:'center',
            xtype:'grid',
            itemId:'syncErrorGrid',
            title:'Sync Errors',
            frame:true,
//            minHeight:120,
            height:'40%',
            loadMask:true,
            features:[
                {ftype:'grouping'}
            ],
            sortableColumns:false,
            viewConfig:{
                emptyText:'No Sync Errors',
                deferEmptText:false
            },
            store:'syncErrors',
            columns:[
                {header:'ID', dataIndex:'id', width:36},
                {header:'PIDs', dataIndex:'pids'},
                {header:'Patient', dataIndex:'patient', flex:1},
                {header:'Date&nbsp;Created', dataIndex:'dateCreated'},
                {header:'Item', dataIndex:'item', groupable:true, flex:2},
                {header:'Message', dataIndex:'message', groupable:true, flex:2}
            ],
            tools: [
                {
                    xtype:'button',
                    itemId: 'clearAllSyncErrorsButton',
                    ui: 'warning',
                    text:'Clear All Sync Errors'
                }
            ],
            dockedItems:[
                {
                    xtype:'toolbar',
                    dock:'top',
                    items:[
						{
							xtype: 'textfield',
							fieldLabel: 'Search',
                            id:"SearchTextBox"
						},

                        {
							xtype: 'checkbox',
							id: 'patientId',
                            boxLabel:'Patient ID'
                        },{
                            xtype: 'checkbox',
                            id: 'patientDfn',
                            boxLabel:'Patient Dfn'
                        },{
                            xtype: 'checkbox',
                            id: 'patientIcn',
                            boxLabel:'Patient Icn'
                        },{
                            xtype: 'checkbox',
                            id: 'domain',
                            boxLabel:'Domain'
                        },{
                            xtype: 'checkbox',
                            id: 'StackCheckBox',
                            boxLabel: 'StackTrace'
                        },{
                            xtype: 'checkbox',
                            id: 'rpcItemContent',
                            boxLabel: 'JSON'
                        },{
                            xtype: 'checkbox',
                            id: 'rpcUri',
                            boxLabel: 'RPC URI'
                        },


                        {
                            xtype: 'button',
                            text: 'Search',
                            itemId:'SearchNowButton'
                        }
                    ]
                },
                {
                    xtype:'pagingtoolbar',
                    dock:'bottom',
                    store:'syncErrors',
                    displayInfo:true
                }
            ],
            listeners:{
                select:function (grid, record, index) {
                    var me = this;
                    var syncErrorId = record.get('id');
                    me.nextSibling('#syncErrorDetail').loadRecord(record);
                    me.nextSibling('#syncErrorDetail').down('button').setVisible(true);
                }
            }
        },
        {
            region:'south',
            xtype:'form',
            itemId:'syncErrorDetail',
            title:'Sync Error Detail',
            split:true,
            height:'60%',
            frame:true,
            bodyPadding:5,
            autoScroll:true,
            fieldDefaults:{
                labelAlign:'right',
                labelSeparator:''
            },
            layout:'anchor',
            defaults:{
                anchor:'100%'
            },
            defaultType:'displayfield',
            items:[
                {
                    xtype: 'button',
                    text: 'Resend Sync Message',
                    hidden: true,
                    ui: 'link',
                    handler: function(bn) {
                        var grid = bn.up('syncerrorspanel').down('grid');
                        var rec = grid.getSelectionModel().getSelection()[0];
                        var recId = rec.get('id');
                        Ext.Ajax.request({
                            url: '/sync/error/redeliver',
                            params: {
                                recId: recId
                            },
                            success: function(resp) {
                                var detailPanel = grid.nextSibling("#syncErrorDetail");
                                grid.getStore().remove(rec);
                                detailPanel.getForm().reset();
                                detailPanel.down('button').setVisible(false);
                                console.log('success');
                            },
                            failure: function(resp) {
                                console.log(resp.responseText);
                            }
                        })
                    },
                    setValue: function(val) {
                        this.setVisible(true);
                    },
                    reset: function() {
                        this.setVisible(false);
                    }
                },
                {
                    fieldLabel:'ID',
                    name:'id'
                },
                {
                    fieldLabel:'PIDs',
                    name:'pids'
                },
                {
                    fieldLabel:'Patient',
                    name:'patient'
                },
                {
                    fieldLabel:'Date Created',
                    name:'dateCreated'
                },
                {
                    fieldLabel:'Message',
                    name:'message'
                },
                {
                    fieldLabel:'Item',
                    name:'item'
                },
                {
                    xtype:'textarea',
                    readOnly:true,
                    grow:true,
                    growMax:400,
                    fieldLabel:'JSON',
                    name:'json'
                },
                {
                    xtype:'textarea',
                    readOnly:true,
                    grow:true,
                    growMax:400,
                    fieldLabel:'Stack Trace',
                    name:'stackTrace'
                }
            ]
        }
    ],
    initComponent:function () {
        var store = Ext.getStore('syncErrors');
        if (!store) {
            Ext.create("gov.va.hmp.admin.SyncErrorStore");
        }
        this.callParent(arguments);
    },
    onBoxReady:function() {
        this.callParent(arguments);
        var store = Ext.getStore('syncErrors');
        store.load();
    }
});