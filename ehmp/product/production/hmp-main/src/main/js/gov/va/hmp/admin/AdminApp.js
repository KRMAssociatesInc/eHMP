Ext.define('gov.va.hmp.admin.AdminApp', {
    extend: 'gov.va.hmp.Application',
    requires:[
        "Ext.util.History",
        "gov.va.hmp.Viewport",
        "gov.va.hmp.admin.AdminScreenSelector",
        "gov.va.hmp.admin.AdminCardPanel",
        'gov.va.hmp.admin.AdminScreenController',
        'gov.va.hmp.admin.TermBrowserController',
        'gov.va.hmp.admin.VistaRpcRunnerController',
        'gov.va.hmp.admin.SyncAdminController'
    ],
    controllers: [
        'gov.va.hmp.admin.AdminScreenController',
        'gov.va.hmp.admin.TermBrowserController',
        'gov.va.hmp.admin.VistaRpcRunnerController',
        'gov.va.hmp.admin.SyncAdminController'
    ],
    init: function() {
        Ext.util.History.init();
    },
    launch:function() {
        Ext.create('gov.va.hmp.Viewport',{
            items: [
                Ext.create('gov.va.hmp.admin.AdminScreenSelector', {
                    region: 'west',
                    margin: '5 0 5 5',
                    split: true
                }),
                Ext.create('gov.va.hmp.admin.AdminCardPanel', {
                    region: 'center',
                    margin: '5 5 5 0'
                })
            ]
        });
   }
});