Ext.define('gov.va.hmp.admin.AdminCardPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.hmp.admin.VprPatientBrowser',
        'gov.va.hmp.admin.SyncErrorsPanel',
        'gov.va.hmp.admin.SyncAdminPanel',
        'gov.va.hmp.admin.VistaAccountAdmin',
        'gov.va.hmp.appbar.AppInfoPropertiesGrid',
        'gov.va.hmp.admin.VistaRpcRunner',
        'gov.va.hmp.admin.VistaRpcBrowser',
        'gov.va.hmp.admin.FrameListPanel',
        'gov.va.hmp.admin.TermBrowserPanel',
        'gov.va.hmp.admin.MetricsPanel',
        'gov.va.hmp.admin.ThreadDumpPanel',
        'gov.va.hmp.admin.HealthCheckPanel',
        'gov.va.hmp.ux.UnderConstruction',
        'gov.va.hmp.admin.IntegrityCheckPanel',
        'gov.va.hmp.admin.ChecksumPanel',
        'gov.va.hmp.admin.ManagePluginsPanel'
    ],
    itemId: 'adminCardPanel',
    hidden: true,
    layout: {
        type: 'card',
        deferredRender: true
    },
    items: [
        {
            xtype: 'vprpatientbrowser'
        },
        {
            xtype: 'syncerrorspanel'
        },
        {
            xtype: 'syncadminpanel',
            itemId: 'sync-vpr'
        },
        {
            xtype: 'vistarpcrunner'
        },
        {
            xtype: 'vistarpcbrowser'
        },
        {
            xtype: 'appinfopropertygrid',
            itemId: 'hmp-properties',
            title: 'HMP Properties',
            appInfo: 'props'
        },
        {
            xtype: 'appinfopropertygrid',
            itemId: 'system-properties',
            title: 'System Properties',
            appInfo: 'system'
        },
        {
            xtype: 'appinfopropertygrid',
            itemId: 'environment-variables',
            title: 'Environment Variables',
            appInfo: 'env'
        },
        {
            xtype: 'jsondataintegritycheck',
            itemId: 'jsondata-integrity',
            title: 'JSON Data Integrity Check',
            appInfo: 'integrity'
        },
        {
            xtype: 'checksumpanel',
            itemId: 'patient-checksum',
            title: 'Patient Checksum',
            appInfo: 'integrity'
        },
        {
            xtype: 'underconstruction',
            itemId: 'browse-odc'
        }
    ],
    initComponent: function () {
        this.callParent(arguments);

//        this.mon(this, 'beforeremove', this.onBeforeRemove, this);

        this.add(Ext.create('Ext.panel.Panel', { itemId: 'drools-edit', html: 'Work In Progress...'}));
        this.add(Ext.create('gov.va.hmp.admin.FrameListPanel'));
        this.add(Ext.create('gov.va.hmp.admin.TermBrowserPanel'));

        this.add(Ext.create('gov.va.hmp.admin.MetricsPanel', { itemId: 'metrics' }))
        this.add(Ext.create('gov.va.hmp.admin.ThreadDumpPanel', { itemId: 'thread-dump' }));
        this.add(Ext.create('gov.va.hmp.admin.HealthCheckPanel', { itemId: 'health-checks' }));

        this.add(Ext.create('gov.va.hmp.admin.ManagePluginsPanel', { itemId: 'manage-plugins' }));
    }

//    onBeforeAdd:function(cmp, index) {
//        this.callParent(arguments);
//        console.log("beforeadd! " + cmp.itemId);
//    },
//    onAdd:function(cmp, index) {
//        this.callParent(arguments);
//        console.log("add!");
//        cmp.on('activate', this.onComponentActivate, this);
//        cmp.on('deactivate', this.onComponentDeactivate, this);
//    },
//    onBeforeRemove:function(container, cmp, index) {
//        console.log("beforeremove!" + cmp.itemId);
//        cmp.un('activate', this.onComponentActivate, this);
//        cmp.un('deactivate', this.onComponentDeactivate, this);
//    },
//    onComponentActivate:function(cmp) {
////        this.callParent();
//        console.log("activate! " + cmp.itemId);
//    },
//    onComponentDeactivate:function(cmp) {
////        this.callParent();
//        console.log("deactivate! " + cmp.itemId);
////        this.remove(cmp);
//    }
});
