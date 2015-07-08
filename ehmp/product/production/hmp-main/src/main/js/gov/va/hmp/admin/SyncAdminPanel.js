Ext.define('gov.va.hmp.admin.SyncAdminPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.hmp.AppContext',
        'gov.va.hmp.UserContext',
        'gov.va.hmp.admin.StatsPanel',
        'gov.va.hmp.team.TeamField',
        'gov.va.cpe.roster.RosterPicker',
        'gov.va.hmp.ptselect.PatientSelector'
    ],
    alias: 'widget.syncadminpanel',
    itemId: 'sync-vpr',
    overflowY: 'scroll',
    defaults: {
        width: '100%',
        maxWidth: 500,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        }
    },
    items: [
        {
            xtype: 'container',
            itemId: 'messages',
            layout: 'vbox'
        },
        {
            xtype: 'statspanel'
        },
        {
            xtype: 'form',
            title: 'Synchronize a Patient List',
            items: [
                {
                    xtype: 'rosterpicker',
                    itemId: 'rosterField',
                    width: '100%'
                },
                {
                    xtype: 'checkbox',
                    itemId: 'errorCheckbox',
                    boxLabel: 'Simulate Errors',
                    handler: function (box, checked) {
                        var chk = checked;
                        Ext.Ajax.request({
                            url: '/sync/simulateErrors/patientData',
                            method: 'POST',
                            params: {
                                simulateErrors: chk
                            },
                            callback: function (response) {
                                if (chk) {
                                    console.log('Now simulating errors.');
                                } else {
                                    console.log('Error simulation turned off.')
                                }
                            }
                        })
                    }
                }
            ],
            buttons: [
                {
                    itemId: 'syncRosterButton',
                    ui: 'primary',
                    text: 'Synchronize Patient List'
                }
            ]
        },
        {
            xtype: 'form',
            itemId: 'syncForm',
            title: 'Synchronize a Patient',
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        { xtype: 'textfield', fieldLabel: 'DFN', name: 'dfn'},
                        { xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'patientselector',
                            listeners: {
                                select: function (selector, record) {
                                    var dfnField = selector.previousSibling('[name=dfn]');
                                    dfnField.setValue(record.get('localId'));
                                    var icnField = selector.up().up().down('[name=icn]');
                                    icnField.setValue(record.get('icn'));
                                }
                            }
                        }
                    ]

                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        { xtype: 'textfield', fieldLabel: 'ICN', name: 'icn' }
                    ]
                }
            ],
            buttons: [
                {
                    itemId: 'syncPatientButton',
                    ui: 'primary',
                    text: 'Synchronize'
                }
            ]
        },
        {
            xtype: 'form',
            itemId: 'clearForm',
            title: 'Unload',
            items: [
                { xtype: 'textfield', fieldLabel: 'DFN', name: 'dfn', flex: 1},
                { xtype: 'textfield', fieldLabel: 'PID', name: 'pid', flex: 1},
                { xtype: 'textfield', fieldLabel: 'ICN', name: 'icn' }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'danger',
                            itemId: 'clearAllPatientsButton',
                            text: 'Unload All Patients'
                        },
                        '->',
                        {
                            xtype: 'button',
                            itemId: 'clearPatientButton',
                            ui: 'primary',
                            text: 'Unload Patient'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'form',
            itemId: 'reindexForm',
            title: 'Reindex',
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'PID',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            name: 'pid'
                        },
                        {
                            xtype: 'tbspacer'
                        },
                        {
                            xtype: 'patientselector',
                            listeners: {
                                select: function (selector, record) {
                                    var pidField = selector.previousSibling('[name=pid]');
                                    pidField.setValue(record.get('pid'));
                                }
                            }
                        }
                    ]
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'reindexAllButton',
                            text: 'Reindex All Patients'
                        },
                        '->',
                        {
                            xtype: 'button',
                            itemId: 'reindexPatientButton',
                            ui: 'primary',
                            text: 'Reindex Patient'
                        }
                    ]
                }
            ]
        }
    ],
    onBoxReady: function () {
        this.callParent(arguments);
        this.down('rosterpicker').getStore().load();

        var store = Ext.getStore('statsStore');
        store.load();
    },
    autorefresh: function () {
        var store = Ext.getStore('statsStore');
        store.load();
    }
});