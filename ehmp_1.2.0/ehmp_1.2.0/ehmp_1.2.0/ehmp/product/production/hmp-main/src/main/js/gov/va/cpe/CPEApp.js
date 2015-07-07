Ext.define('gov.va.cpe.CPEApp', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.ErrorHandler',
        'gov.va.hmp.PatientContext',
        'gov.va.hmp.EncounterContext',
        'gov.va.cpe.CPEController',
        'gov.va.cpe.patient.PatientContextContainer',
        'gov.va.cpe.patient.PatientActionBar',
        'gov.va.cpe.patient.ChartTabs',
        'gov.va.cpe.TaskBoard',
        'gov.va.hmp.ptselect.PatientPicker',
        'gov.va.hmp.ux.layout.SlidingCard',
        'gov.va.hmp.ux.ArrowButton'
    ],
    controllers: [
        'gov.va.cpe.CPEController'
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
        me.loadStylesheet('/lib/jcrop/css/jquery.Jcrop.min.css');

        Ext.util.History.init();
    },
    launch: function () {
        var appInfo = gov.va.hmp.AppContext.getAppInfo();
        if (Ext.isDefined(appInfo.contexts)) {             // context integration stuff
            // restore patient context
            if (Ext.isDefined(appInfo.contexts.pid) && appInfo.contexts.pid != null) {
                gov.va.hmp.EncounterContext.setEncounterUid(appInfo.contexts.pid, appInfo.contexts.encounterUid); // app/info just returns encounter uid only ...

                gov.va.hmp.PatientContext.setPatientContext(appInfo.contexts.pid);
                gov.va.hmp.PatientContext.setPatientInfo(appInfo.contexts.patient);
                delete appInfo.contexts.patient;
            }

//            RosterContext integration
//            if (Ext.isDefined(appInfo.contexts.roster) && appInfo.contexts.roster) {
//                gov.va.cpe.roster.RosterContext.setCurrentRoster(appInfo.contexts.roster);
//                delete appInfo.contexts.roster;
//            }
            // TODO: LocationContext integration
        }

        var cards = [
            {
                xtype: 'container',
                itemId: 'multiPt',
                region: 'center',
                padding: 5,
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
                        xtype: 'container',
                        region: 'north',
                        height: 44,
                        cls: 'hmp-multi-patient-bar-ct',
                        defaults: {
                            cls: 'hmp-multi-patient-bar-item'
                        },
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'component',
                                html: '<h3>Task Board</h3>'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        region: 'center',
                        layout: 'fit',
                        style: {
                            backgroundColor: '#FFF',
                            borderStyle: 'solid',
                            borderWidth: '0px 1px 1px 1px',
                            borderColor: '#ddd'
                        },
                        items: [
                            {
                                xtype: 'taskboard'
                            }
                        ]
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
                        xtype: 'patientpicker',
                        ui: 'well',
                        region: 'west',
                        enablePreselect: true,
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
                                xtype: 'ptactionbar',
                                region: 'north'
                            },
                            {
                                xtype: 'charttabs',
                                region: 'center',
                                itemId: 'PatientPanelID'
                            }
                        ]
                    }
                ]
            }
        ];
        var activeItem = 1;

        for(var idx = 0; idx<cards.length; idx++) {
            if(cards[idx].itemId == appInfo.contexts.cpeActiveItem) {
                activeItem = idx;
            }
        }

//        this.mon(gov.va.cpe.roster.RosterContext, "rostercontextchange", this.saveContexts, this);
        Ext.create('gov.va.hmp.Viewport', {
            cls: 'hmp-workspace',
            items: [
                {
                    xtype: 'container',
                    itemId: 'singleMultiPtCt',
                    cls: 'hmp-workspace',
                    region: 'center',
                    layout: {
                        type: 'slidingcard',
                        activeItem: activeItem
                    },
                    items: cards
                }
            ]
        });
    }
});