Ext.define('gov.va.hmp.setup.PointOfCarePanel', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.cpe.store.PointOfCareStore'
    ],
    layout:'border',
    items:[
        {
            xtype:'grid',
            ui: 'well',
            frame: true,
            itemId: 'pocList',
            minWidth:260,
            width:260,
            split: true,
            region:'west',
            title:'Point Of Care / Location',
            emptyText: 'No Locations Found',
            columns:[
                { text:'Name', flex:1, dataIndex:'displayName' },
                {
                    xtype:'actioncolumn',
                    width:20,
                    items:[
                        {
                            iconCls: 'fa-times-circle',
                            tooltip:'Remove Location'
                        }
                    ]
                }
            ],
            tools:[
                {
                    xtype:'button',
                    ui:'link',
                    itemId:'createPointOfCareButton',
                    text:'New Location'
                }
            ]
        },
        {
            xtype:'form',
            disabled: true,
            itemId: 'pointOfCareEdit',
            region:'center',
            layout:'anchor',
            defaults:{
                anchor:'100%'
            },
            tools: [
                {
                    xtype:'button',
                    ui: 'link',
                    itemId:'deletePointOfCareButton',
                    text:'Remove'
                },
                {
                    xtype:'button',
                    itemId:'savePointOfCareButton',
                    text:'Save'
                }
            ],
            items:[
                {
                    xtype:'textfield',
                    itemId: 'pointOfCareNameField',
                    name:'displayName',
                    fieldLabel:'Name',
                    emptyText: 'Name',
                    enableKeyEvents: true
                },
                {
                    xtype:'textarea',
                    itemId: 'pointOfCareDescriptionField',
                    name:'description',
                    emptyText: 'Description',
                    fieldLabel:'Description',
                    height:200
                }
            ]
        }
    ],
    initComponent:function () {
        var pocStore = Ext.create('gov.va.cpe.store.PointOfCareStore');

        this.items[0].store = pocStore;

        this.callParent(arguments);
        var me = this;
//        this.down('grid').on('selectionchange', function(grid, sel) {
//        	me.down('form').setDisabled(sel.length==0);
//        	if(sel.length==0) {me.down('form').getForm().reset();}
//        });
    },
    onBoxReady:function() {
        this.callParent(arguments);
        this.down('grid').getStore().load();
    }
});