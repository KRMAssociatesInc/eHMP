Ext.define('gov.va.cprs.CoverSheet', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cprs.coversheet.Appointments',
        'gov.va.cprs.coversheet.ActiveProblems',
        'gov.va.cprs.coversheet.ActiveMedications',
        'gov.va.cprs.coversheet.Allergies',
        'gov.va.cprs.coversheet.RecentLabs',
        'gov.va.cprs.coversheet.RecentVitals',
        'gov.va.cprs.coversheet.Reminders'
    ],
    alias: 'widget.classiccoversheet',
    mixins: {
            patientaware: 'gov.va.hmp.PatientAware'
    },
    title: 'Cover Sheet',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                Ext.create('gov.va.cprs.coversheet.ActiveProblems', {
                    flex: 1
                }),
                {
                    xtype: 'splitter'
                },
                Ext.create('gov.va.cprs.coversheet.Allergies', {
                    flex: 1
                }),
                {
                    xtype: 'splitter'
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            ui: 'bordered',
                            title: 'Patient Record Flags',
                            flex: 1
                        },
                        {
                            xtype: 'splitter'
                        },
                        {
                            xtype: 'viewdefgridpanel',
                            ui: 'bordered',
                            title: 'Postings',
                            flex: 1,
                            viewID: 'gov.va.cpe.vpr.queryeng.ProfileDocsViewDef',
                            hideHeaders: true,
                            detailType: 'window',
                            detailTitleField: 'localTitle',
                            detail: {
                                width: 600,
                                height: 400
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'splitter'
        },
        {
            xtype: 'container',
            flex: 2,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                Ext.create('gov.va.cprs.coversheet.ActiveMedications', {
                    flex: 2
                }),
                {
                    xtype: 'splitter'
                },
                Ext.create('gov.va.cprs.coversheet.Reminders', {
                    flex: 3
                })
            ]
        },
        {
            xtype: 'splitter'
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                Ext.create('gov.va.cprs.coversheet.RecentLabs', {
                    flex: 1
                }),
                {
                    xtype: 'splitter'
                },
                Ext.create('gov.va.cprs.coversheet.RecentVitals', {
                    flex: 1
                }),
                {
                    xtype: 'splitter'
                },
                Ext.create('gov.va.cprs.coversheet.Appointments', {
                    flex: 1
                })
            ]
        }
    ],
    initEvents: function () {
        var me = this;

        me.callParent(arguments);

        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            me.mon(components[i], 'selectionchange', me.onSelectionChange, me);
        }

        me.mon(me, 'patientchange', me.onPatientChange, me);
    },
    onPatientChange: function (pid) {
        this.pid = pid;
        if (!this.pid || pid == 0) return;
        var rem = this.down("#clinicalReminders");
        rem.viewParams.filter_dfn = gov.va.hmp.PatientContext.getPatientInfo().localId;
        rem.viewParams.filter_user = gov.va.hmp.UserContext.getUserInfo().duz;
        rem.setViewDef(rem.curViewID, rem.viewParams, true);
    },
    // coordinates only one selection amongst all cover sheet components
    onSelectionChange: function (selModel, selection) {
        var me = this;
        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            if (components[i].getSelectionModel() !== selModel) {
                components[i].getSelectionModel().deselectAll();
            }
        }
    }
});