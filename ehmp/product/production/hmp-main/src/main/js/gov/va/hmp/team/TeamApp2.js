Ext.define('gov.va.hmp.team.TeamApp2', {
    extend:'gov.va.hmp.Application',
    requires:[
        'gov.va.hmp.Viewport',
        'gov.va.hmp.team.TeamSelector',
        'gov.va.hmp.team.TeamManagementPanel'
    ],
    launch:function () {
        Ext.create('gov.va.hmp.Viewport', {
            items:[
                Ext.create('gov.va.hmp.team.TeamSelector', {
                    region:'west',
                    split:true
                }),
                Ext.create('gov.va.hmp.team.TeamPanel', {
                    region:'center'
                })
            ]
        });
    }
});