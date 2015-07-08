Ext.define('gov.va.cpe.CPEIncubator', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.ErrorHandler',
        'gov.va.hmp.PatientContext',
        'gov.va.hmp.EncounterContext',
        'gov.va.cpe.CPEIncubatorController',
        'gov.va.cpe.patient.PatientContextContainer',
        'gov.va.cpe.patient.IncubatingPatientActionBar',
        'gov.va.cpe.patient.IncubatingChartTabs',
        'gov.va.hmp.ptselect.PatientPicker',
        'gov.va.cpe.roster.RosterContext',
        'gov.va.cpe.multi.BoardContext',
        'gov.va.cpe.multi.MultiPatientBar',
        'gov.va.cpe.viewdef.BoardGridPanel',
        'gov.va.hmp.ux.layout.CrossfadeCard',
        'gov.va.hmp.ux.layout.SlidingCard',
        'gov.va.hmp.ux.ArrowButton'
    ],
    controllers: [
        'gov.va.cpe.CPEIncubatorController'
    ],
    init: function () {
        var me = this;
        me.loadScript({
            url: '/lib/highcharts/highcharts.js',
            onLoad: function () {
                me.loadScript('/lib/highcharts/highcharts-more.js');
            },
            scope: this
        });

        Ext.util.History.init();
    },
    launch: function () {
        var appInfo = gov.va.hmp.AppContext.getAppInfo();
        if (Ext.isDefined(appInfo.contexts)) {             // context integration stuff

            if (Ext.isDefined(appInfo.contexts.encounterUid) && appInfo.contexts.encounterUid != null) {
                gov.va.hmp.EncounterContext.setEncounterUid(appInfo.contexts.pid, appInfo.contexts.encounterUid); // app/info just returns encounter uid only ...
            }

            // restore patient context
            if (Ext.isDefined(appInfo.contexts.pid) && appInfo.contexts.pid != null) {
                gov.va.hmp.PatientContext.setPatientContext(appInfo.contexts.pid);
                gov.va.hmp.PatientContext.setPatientInfo(appInfo.contexts.patient);
                delete appInfo.contexts.patient;
            }

//            RosterContext integration
            if (Ext.isDefined(appInfo.contexts.roster) && appInfo.contexts.roster) {
                gov.va.cpe.roster.RosterContext.setCurrentRoster(appInfo.contexts.roster);
                delete appInfo.contexts.roster;
            }

//            BoardContext integration
            if (Ext.isDefined(appInfo.contexts.board) && appInfo.contexts.board) {
                gov.va.cpe.multi.BoardContext.setCurrentBoard(appInfo.contexts.board);
                delete appInfo.contexts.board;
                delete appInfo.contexts.boardUid;
            }
            // TODO: LocationContext integration
        }

//        this.mon(gov.va.cpe.roster.RosterContext, "rostercontextchange", this.saveContexts, this);
        Ext.create('gov.va.hmp.Viewport', {
            cls: 'hmp-workspace',
            items: [
                {
                    xtype: 'container',
                    itemId: 'singleMultiPtCt',
                    region: 'center',
                    layout: {
                        type: 'slidingcard',
                        activeItem: 1
                    },
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'multiPt',
                            region: 'center',
                            padding: 5,
                            cls: 'hmp-context-bar-ct',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'container',
                                    region: 'north',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'tbspacer',
                                            flex: 1
                                        },
                                        {
                                            xtype: 'arrowbutton',
                                            cls: 'ios-6-arrow-single-pt',
                                            itemId: 'next',
                                            direction: 'right',
                                            text: 'Switch to Single-Patient',
                                            margin: '0 0 5 0'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'multipatientbar',
                                    region: 'north'
                                },
                                {
                                    xtype: 'boardgridpanel',
                                    region: 'center',
                                    padding: '0 0 10 0'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            itemId: 'singlePt',
                            layout: 'border',
                            items: [
                                {
                                    xtype: 'container',
                                    region: 'north',
                                    margin: '5 5 0 5',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'arrowbutton',
                                            cls: 'ios-6-arrow-multi-pt',
                                            itemId: 'prev',
                                            text: 'Switch to Multi-Patient Board'
                                        },
                                        {
                                            xtype: 'tbspacer',
                                            flex: 1
                                        }
                                    ]
                                },
                                {
                                    xtype:'patientpicker',
                                    ui: 'well',
                                    enablePreselect: true,
                                    region: 'west',
                                    split: true,
                                    collapsible: true,
                                    margin: '5 0 5 5',
                                    width: 300
                                },
                                {
                                    xtype: 'ptcontextcontainer',
                                    region: 'center',
                                    margin: '5 5 5 0',
                                    layout: 'border',
                                    items: [
                                        {
                                            xtype: 'incubatingptactionbar',
                                            region: 'north'
                                        },
                                        {
                                            xtype: 'incubatingcharttabs',
                                            region: 'center',
                                            itemId: 'PatientPanelID'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
});