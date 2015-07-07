Ext.define('gov.va.hmp.team.TeamPanel', {
    extend:'Ext.panel.Panel',
    requires:[
        'gov.va.hmp.EventBus',
        'gov.va.hmp.team.TeamTile',
        'gov.va.hmp.containers.LinkBar',
        'gov.va.cpe.roster.RosterPicker'
    ],
    title:'No Team Selected',
    bodyPadding:12,
    items:[
        {
            xtype:'form',
            fieldDefaults:{
                labelSeparator:null,
                labelAlign:'right'
            },
            items:[
                {
                    xtype:'displayfield',
                    name:'owner',
                    fieldLabel:'Owner'
                },
                {
                    xtype:'rosterpicker',
                    name:'roster',
                    fieldLabel:'Patient List'
                }
            ]
        },
        {
            xtype:'grid',
            itemId:'careTeamGrid',
            title:'Healthcare Associates',
            ui: 'gadget',
            margin:'24 0 12 0',
            emptyText:'No team members assigned',
            columns:[
                {
                    text:'Position',
                    dataIndex:'position',
                    editor:{
                        xtype:'teampositionfield'
                    }
                },
                {
                    text:'Person',
                    dataIndex:'person',
                    editor:{
                        xtype:'personfield',
                        valueField:'name',
                        displayField:'name'
                    },
                    flex:1
                }
            ],
            selType:'cellmodel',
            plugins:[
                {
                    ptype:'cellediting',
                    clicksToEdit:1
                }
            ],
            bbar:[
                {
                    icon:'/images/icons/ic_plus.png',
                    qtip:'Add Team Position',
                    listeners:{
                        click:function (button) {
                            var newRecord = { position:'New Position', person:null};
                            button.up('teamtile').getStore().add(newRecord);
                        }
                    }
                }
            ]
        },
        {
            xtype:'grid',
            title:'Patients',
            margin:'24 0 12 0',
            columns:[
                {text:'Name'}
            ]
        }
    ],
    initComponent:function () {
        var me = this;
        me.callParent(arguments);
        gov.va.hmp.EventBus.on('teamselect', me.setTeam, me);
    },
    getTeamPositionStore:function () {
        return this.down('#careTeamGrid').getStore();
    },
    setTeam:function (team) {
        var me = this;
        me.getTeamPositionStore().removeAll();

        me.team = team;

        if (team != null) {
            me.setTitle(team.get('displayName'));
            var owner = team.get('owner') ? team.get('owner') : VPR.appbar.userName;
            me.down('form').getForm().setValues({
                owner:owner
            });
            me.getTeamPositionStore().add(team.get('positions'));
        }
    }
});
