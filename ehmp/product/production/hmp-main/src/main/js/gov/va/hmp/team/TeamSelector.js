Ext.define('gov.va.hmp.team.TeamSelector', {
    extend:'Ext.grid.Panel',
    requires:[
        'gov.va.hmp.EventBus'
    ],
    ui:'plain',
//    title:'Teams',
    hideHeaders:true,
    dockedItems:[
        {
            xtype:'toolbar',
            docked:'top',
            ui:'plain',
            items:[
                '->',
                {
                    xtype:'button',
                    ui:'link',
                    text:'Add New Team',
                    listeners:{
                        click:function () {
                            Ext.getStore('teams').insert(0, {displayName:'New Team', owner:VPR.appbar.userName});
                        }
                    }
                }
            ]
        }
    ],
    store:Ext.create('Ext.data.Store', {
        storeId:'teams',
        fields:['displayName', 'owner', 'positions'],
        associations:[
            { type:'hasMany', model:'gov.va.hmp.team.TeamPosition', associationKey:'positions' }
        ],
        proxy:{
            type:'ajax',
            url:'/js/gov/va/hmp/team/teams.json',
            reader:{
                type:'json',
                root:'data.items'
            }
        }
    }),
    columns:[
        {text:'Team', dataIndex:'displayName', flex:1}
    ],
    listeners:{
        select:function (rowModel, record) {
            gov.va.hmp.EventBus.fireEvent('teamselect', record);
        }
    },
    initComponent:function () {
        var me = this;
        me.callParent(arguments);
    },
    onBoxReady:function() {
        this.callParent(arguments);
        this.store.load();
    }
});
