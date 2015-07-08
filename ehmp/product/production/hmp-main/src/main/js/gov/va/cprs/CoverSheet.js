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
    title: 'Classic Cover Sheet',
    padding: '0 5 5 5',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            itemId: 'row1',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        },
        {
            xtype: 'splitter'
        },
        {
            xtype: 'container',
            itemId: 'row2',
            flex: 2,
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        },
        {
            xtype: 'splitter'
        },
        {
            xtype: 'container',
            itemId: 'row3',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        }
    ],
    initComponent: function () {
        // adding components here so that each coversheet component doesn't need its own xtype
        this.items[0].items = [
            Ext.create('gov.va.cprs.coversheet.ActiveProblems', {
                ui: 'condensed',
                flex: 1,
                frame: true,
                rowLines: false
            }),
            {
                xtype: 'splitter'
            },
            Ext.create('gov.va.cprs.coversheet.Allergies', {
                ui: 'condensed',
                flex: 1,
                frame: true,
                rowLines: false
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
                        ui: 'condensed',
                        title: 'Patient Record Flags',
                        frame: true,
                        flex: 1
                    },
                    {
                        xtype: 'splitter'
                    },
                    {
                        xtype: 'viewdefgridpanel',
                        ui: 'condensed',
                        title: 'Postings',
                        frame: true,
                        flex: 1,
                        rowLines: false,
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
        ];
        this.items[2].items = [
            Ext.create('gov.va.cprs.coversheet.ActiveMedications', {
                ui: 'condensed',
                frame: true,
                flex: 2,
                rowLines: false
            }),
            {
                xtype: 'splitter'
            },
            Ext.create('gov.va.cprs.coversheet.Reminders', {
                ui: 'condensed',
                frame: true,
                flex: 3,
                rowLines: false
            })
        ];
        this.items[4].items = [
            Ext.create('gov.va.cprs.coversheet.RecentLabs', {
                ui: 'condensed',
                frame: true,
                flex: 1,
                rowLines: false
            }),
            {
                xtype: 'splitter'
            },
            Ext.create('gov.va.cprs.coversheet.RecentVitals', {
                ui: 'condensed',
                frame: true,
                flex: 1,
                rowLines: false
            }),
            {
                xtype: 'splitter'
            },
            Ext.create('gov.va.cprs.coversheet.Appointments', {
                ui: 'condensed',
                frame: true,
                flex: 1,
                rowLines: false
            })
        ];

        this.callParent(arguments);

        this.mon(this, 'patientchange', this.onPatientChange, this);
    },
    initEvents: function () {
        var me = this;

        me.callParent(arguments);

        var components = me.query('gridpanel');
        for (var i = 0; i < components.length; i++) {
            me.mon(components[i], 'selectionchange', me.onSelectionChange, me);
        }
    },

    onPatientChange: function (pid) {
        this.pid = pid;
        if (!this.pid || pid == '') return;
        var rem = this.down("#clinicalReminders");
        if (rem && rem.rendered) {
            rem.viewParams.filter_dfn = gov.va.hmp.PatientContext.getPatientInfo().localId;
            rem.viewParams.filter_user = gov.va.hmp.UserContext.getUserInfo().duz;
            rem.setViewDef(rem.curViewID, rem.viewParams, true);
        }
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