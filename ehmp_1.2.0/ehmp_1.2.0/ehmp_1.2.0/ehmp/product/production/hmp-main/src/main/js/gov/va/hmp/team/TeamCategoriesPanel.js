Ext.define('gov.va.hmp.team.TeamCategoriesPanel', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.team.TeamCategoryStore'
    ],
    layout:'border',
    items:[
        {
            xtype:'grid',
            ui: 'well',
            frame: true,
            itemId: 'categoryList',
            minWidth:260,
            width:260,
            split: true,
            region:'west',
            title:'Team Categories',
            emptyText: 'No Team Categories Found',
            columns:[
                { text:'Name', flex:1, dataIndex:'name' },
                {
                    xtype:'actioncolumn',
                    width:20,
                    items:[
                        {
                            iconCls: 'fa-times-circle',
                            tooltip:'Remove Category'
                        }
                    ]
                }
            ],
            tools:[
                {
                    xtype:'button',
                    ui:'link',
                    itemId:'createCategoryButton',
                    text:'New Category'
                }
            ]
        },
        {
            xtype:'form',
            title: '&nbsp;',
            disabled: true,
            itemId: 'categoryEdit',
            region:'center',
            layout:'anchor',
            defaults:{
                anchor:'100%'
            },
            items:[
                {
                    xtype:'textfield',
                    itemId: 'categoryNameField',
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
                    itemId:'deleteCategoryButton',
                    ui: 'link',
//                    disabled:false,
                    text:'Remove'
                },
                {
                    xtype:'button',
                    itemId:'saveCategoryButton',
//                    disabled:true,
                    text:'Save'
                }
            ]
        }
    ],
    initComponent:function () {
        var catStore = Ext.create('gov.va.hmp.team.TeamCategoryStore');
        this.items[0].store = catStore;

        this.callParent(arguments);
        var me = this;
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