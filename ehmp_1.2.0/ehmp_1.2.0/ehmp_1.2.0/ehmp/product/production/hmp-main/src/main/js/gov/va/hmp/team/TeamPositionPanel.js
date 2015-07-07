Ext.define('gov.va.hmp.team.TeamPositionPanel', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.team.TeamPositionStore'
    ],
    layout:'border',
    items:[
        {
            xtype:'grid',
            ui: 'well',
            frame: true,
            itemId: 'positionList',
            componentCls: 'hmp-bubble',
            minWidth:260,
            width:260,
            split: true,
            region:'west',
            title:'Team Positions',
            columns:[
                { text:'Name', flex:1, dataIndex:'name' },
                {
                    xtype:'actioncolumn',
                    width:20,
                    items:[
                        {
                            iconCls: 'fa-times-circle',
                            tooltip:'Remove Position'
                        }
                    ]
                }
            ],
            tools:[
                {
                    xtype:'button',
                    ui: 'link',
                    itemId:'createPositionButton',
                    text:'New Position'
                }
            ]
        },
        {
            xtype:'form',
            title: '&nbsp;',
            disabled: true, // 'till first selection
            itemId: 'positionEdit',
            componentCls: 'hmp-bubble',
            region:'center',
            layout:'anchor',
            defaults:{
                anchor:'100%'
            },
            items:[
                {
                    xtype:'textfield',
                    itemId: 'positionNameField',
                    name:'name',
                    fieldLabel:'Name',
                    emptyText: 'Name',
                    enableKeyEvents: true
                },
                {
                    xtype:'textarea',
                    name:'description',
                    emptyText: 'Description',
                    fieldLabel:'Description',
                    height:200
                }
            ],
            tools: [
                {
                    xtype:'button',
                    ui: 'link',
                    itemId:'deletePositionButton',
                    text:'Remove'
                },
                {
                    xtype:'button',
                    itemId:'savePositionButton',
                    text:'Save'
                }
            ]
        }
    ],
    initComponent:function () {
    	var me = this;
    	
        var positionStore = Ext.getStore('teamPositions');
        if (!positionStore) {
            positionStore = Ext.create('gov.va.hmp.team.TeamPositionStore');
        }
        this.items[0].store = positionStore;

        this.callParent(arguments);
        
        this.down('grid').on('selectionchange', function(grid, sel) {
        	me.down('form').setDisabled(sel.length==0);
        	if(sel.length==0) {me.down('form').getForm().reset();}
        });
    },
    onBoxReady:function() {
        this.callParent(arguments);
        this.down('grid').getStore().load();
    }
});