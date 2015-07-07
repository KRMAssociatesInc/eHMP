Ext.define('gov.va.cprs.CPRSApp', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.ErrorHandler',
        'gov.va.hmp.Viewport',
        'gov.va.hmp.PatientContext',
        'gov.va.cpe.patient.PatientContextContainer',
        'gov.va.hmp.ptselect.PatientSelector',
        'gov.va.cprs.CoverSheet',
        'gov.va.cprs.Problems',
        'gov.va.cprs.Meds',
        'gov.va.cprs.Orders',
        'gov.va.cprs.Notes',
        'gov.va.cprs.Consults',
        'gov.va.cprs.Surgery',
        'gov.va.cprs.DischargeSummaries',
        'gov.va.cprs.Labs',
        'gov.va.cprs.Reports',
        'gov.va.hmp.ux.PopUpButton'
    ],
    controllers: [
        'gov.va.cprs.CPRSController'
    ],
    init: function () {
        Ext.util.History.init();
    },
    launch: function () {
        var appInfo = gov.va.hmp.AppContext.getAppInfo();
        if (Ext.isDefined(appInfo.contexts)) {             // context integration stuff
            // restore patient context
            var params = Ext.Object.fromQueryString(window.location.search);
            if (params && params.pid) {
                gov.va.hmp.PatientContext.setPatientContext(params.pid);
            } else if (Ext.isDefined(appInfo.contexts.pid) && appInfo.contexts.pid != null) {
                gov.va.hmp.PatientContext.setPatientContext(appInfo.contexts.pid);
            }

            // TODO: LocationContext integration
        }

        var viewport = Ext.create('gov.va.hmp.Viewport', {
            cls: 'hmp-workspace',
            items: [
                {
                    xtype: 'container',
                    region: 'center',
                    cls: 'hmp-cpe-panel',
                    padding: '6',
                    layout: {
                        type: 'border',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'container',
                            region: 'north',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'toolbar',
                                    ui: 'plain',
                                    padding: '0 0 6 0',
                                    items: [
                                        {
                                            xtype: 'patientselector',
                                            listeners: {
                                                select: function(cmp, pt) {
                                                    gov.va.hmp.PatientContext.setPatientContext(pt.get("pid"));
                                                }
                                            }
                                        }
                                  ]
                                }
                            ]
                        },
                        {
                            xtype: 'ptcontextcontainer',
                            region: 'center',
                            items: [
                                {
                                    xtype: 'tabpanel',
                                    itemId: 'classicTabs',
                                    padding: '5',
//                                    style: {
//                                        background: 'white'
//                                    },
                                    bodyPadding: '0 0 5 0',
                                    tabPosition: 'bottom',
                                    defaultType: 'container',
                                    items: [
                                        { xtype: 'classiccoversheet'}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        var tabpanel = viewport.down('#classicTabs');
        tabpanel.add(Ext.create('gov.va.cprs.Problems'));
        tabpanel.add(Ext.create('gov.va.cprs.Meds'));
        tabpanel.add(Ext.create('gov.va.cprs.Orders'));
        tabpanel.add(Ext.create('gov.va.cprs.Notes'));
        tabpanel.add(Ext.create('gov.va.cprs.Consults'));
        tabpanel.add(Ext.create('gov.va.cprs.Surgery'));
        tabpanel.add(Ext.create('gov.va.cprs.DischargeSummaries'));
        tabpanel.add(Ext.create('gov.va.cprs.Labs'));
        tabpanel.add(Ext.create('gov.va.cprs.Reports'));

        var appmenu = viewport.down('#AppMenuID');
        appmenu.add({
            xtype: 'popupbutton',
            text: 'Alerts',
            popUp:  {
                xtype: 'viewdefgridpanel',
                title: 'Alerts',
                width: 800,
                height: 600,
                viewID: 'gov.va.cprs.CprsClassicAlertsViewDef',
//                    addFilterTool: true,
                title: 'Alerts'
//                    detailTitleTpl: '{localTitle}'
            }
        });
    }
});
