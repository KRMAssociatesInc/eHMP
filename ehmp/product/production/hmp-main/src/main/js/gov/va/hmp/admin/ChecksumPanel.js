Ext.define('gov.va.hmp.admin.ChecksumPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.hmp.admin.AccountModel',
        'gov.va.hmp.admin.PatientModel'
    ],
    flex: 1,
    title: 'Patient Checksum',
    alias: 'widget.checksumpanel',
//    itemId: 'checksumpanel',
    vistaCrc: '',
    jdsCrc: '',
    result: '',
    pid: '',
    vistaId: '',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'panel',
            title: 'Check all patients in JDS',
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'allTaskBtn',
                    text: 'Perform Checksums (All Patients)'
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Check a patient',
            items: [
                {
                    xtype: 'combobox',
                    itemId: 'vistaaccounts',
                    name: 'vistaAccounts',
                    editable: false,
                    fieldLabel: 'VistA Accounts',
                    emptyText: 'Select a VistA Account',
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    forceSelection: true,
                    size: 100,
                    store: {
                        storeId: 'accountStore',
                        model: 'gov.va.hmp.admin.AccountModel',
                        proxy: {
                            type: 'ajax',
                            url: '/check/getAccounts',
                            reader: {
                                type: 'json',
                                root: 'data.items'
//                                totalProperty: 'data.totalItems'
                            }
                        }
                    }

                },
                {
                    xtype: 'combobox',
                    itemId: 'patientsforaccount',
                    name: 'patientsForAccount',
                    editable: false,
                    fieldLabel: 'Patients',
                    emptyText: 'Select a Patient',
                    displayField: 'name',
                    valueField: 'pid',
                    allowBlank: false,
                    forceSelection: true,
                    size: 100,
                    store: {
                        storeId: 'patientStore',
                        model: 'gov.va.hmp.admin.PatientModel',
                        proxy: {
                            type: 'ajax',
                            url: '/check/getPatients',
                            reader: {
                                type: 'json',
                                root: 'data.items'
//                                totalProperty: 'data.totalItems'
                            }
                        }
                    }

                },
                {
                    xtype: 'button',
                    itemId: 'patientCheckBtn',
                    text: 'Perform Checksum (Single Patient)'
                }
            ]

        },
        {
            xtype: 'grid',
            itemId: 'patientsGrid',
            collapse: true,
            collapsible: true,
            flex: 1,
//            hidden: true,
            store: Ext.create('Ext.data.ArrayStore', {
                fields: [
                    {name: 'idValue'},
                    {name: 'pid'},
                    {name: 'vistaAccount'},
                    {name: 'vistaId'},
                    {name: 'patientName'},
                    {name: 'dfn'},
                    {name: 'server'},
                    {name: 'vista'},
                    {name: 'jds'},
                    {name: 'result'},
                    {name: 'same'}
                ]
            }),
            columns: [
                {
                    header: 'pid',
                    dataIndex: 'pid',
                    sortable: false,
                    hideable: false,
                    flex: 1
                },
                {
                    header: 'Patient',
                    dataIndex: 'patientName',
                    sortable: false,
                    hideable: false,
                    flex: 2
                },
                {
                    header: 'Account',
                    dataIndex: 'vistaAccount',
                    sortable: false,
                    hideable: false,
                    flex: 1
                },
                {
                    header: 'Same',
                    dataIndex: 'same',
                    sortable: false,
                    hideable: false,
                    flex: 1
                }
            ]


        },
        {
            xtype: 'panel',
            itemId: 'resultPanel',
            title: 'Comparison Results',
            autoScroll: true,
            flex: 1,
            fbar: [
                {
                    xtype: 'button',
                    itemId: 'jsonBtn',
                    text: 'Sync Incorrect Uids'
                }
            ]
//                    align: 'fit',
//                    width: '95%'
        },
        {
            xtype: 'panel',
            itemId: 'checksumGroupPanel',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
//                    defaults: {
//                        flex: 1,
//                        labelAlign: 'top',
//                        labelSeparator: ''
//                    },
            items: [
                {
                    xtype: 'panel',
                    itemId: 'sourcePanel',
                    title: 'VistA Checksum',
                    flex: 1,
//                            width: '40%',
                    autoScroll: true
//                            style:'overflow-y: scroll',
//                                                preventScrollbars: false

                },
                {
                    xtype: 'panel',
                    itemId: 'comparePanel',
                    title: 'JDS Checksum',
                    flex: 1,
//                            width: '40%',
                    autoScroll: true
//                            style:'overflow-y: scroll',
//                                                preventScrollbars: false

                }
            ]
        }


    ],
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me.down('#vistaaccounts'), 'select', me.onAccountSelect, me);
        me.mon(me.down('#patientCheckBtn'), 'click', me.onPatientClick, me);
        me.mon(me.down('#allTaskBtn'), 'click', me.onAllPatientClick, me);
        me.mon(me.down('#patientsGrid'), 'select', me.onGridSelect, me);
        me.mon(me.down('#jsonBtn'), 'click', me.onJsonBtnClick, me);
    },

    onAccountSelect: function (combo, records, eopts) {
        var me = this;
        var account = this.down('#vistaaccounts').getValue();
        me.loadPatientsForAccount(account);
        me.vistaId = account
    },

    loadPatientsForAccount: function (account) {
        if (account && account.length > 0) {
            var ptbox = this.down('#patientsforaccount');
            ptbox.clearValue();
            ptbox.getStore().removeAll();
            ptbox.getStore().clearFilter();
            ptbox.getStore().getProxy().extraParams.vistaId = account;
            ptbox.getStore().load();
        }
    },

    onPatientClick: function () {
        var me = this
        var account = this.down('#vistaaccounts').getValue();
        var patientCb = this.down("#patientsforaccount");
        var patient = patientCb.findRecordByValue(patientCb.getValue());
        var pid = patient.data.pid;
        me.pid = pid;
        var dfn = patient.data.dfn;
        var grid = me.down('#patientsGrid');
        grid.getStore().removeAll();
        me.updateResults('', '', '');
        me.startChecksumRequest(dfn, pid, account, '');
    },

    onAllPatientClick: function () {
        me = this;
        var grid = me.down('#patientsGrid');
        grid.getStore().removeAll();
        me.updateResults('', '', '');
        Ext.Ajax.request(
            {
                url: '/check/getAllPatient',
                method: "GET",
//                timeout: '5000000',
                success: function (response) {
                    var json = Ext.decode(response.responseText);
                    grid.getStore().removeAll();
                    grid.getStore().loadData(json);
                    grid.expand(true);
                    var store = grid.getStore();
                    store.each(function (r) {
                        var idValue = r.get('idValue');
                        var vistaId = r.get('vistaId');
                        var pid = r.get('pid');
                        var dfn = r.get('dfn');
                        me.startChecksumRequest(dfn, pid, vistaId, idValue);
                    });
                },
                failure: function (response) {
                }
            }
        )

    },
    onJsonBtnClick: function () {
        var me = this;
        var jds = this.result;
        var pid = jds.pid;
        if (!pid) {
            Ext.MessageBox.alert("Error", "Checksums do not differ");
            return
        }
        var uids = jds.uids
        for (var i in uids) {
            var uid = uids[i].uid;
            var reason = uids[i].reason;
            if (reason.indexOf("VistA") > -1) continue;
            me.updateUidRecord(uid);
        }
    },
    updateUidRecord: function (uid) {
        var me = this;
        var pid = me.pid;
        var account = me.vistaId;
        Ext.Ajax.request(
            {
                url: '/check/updateUid',
                method: "GET",
                timeout: '500000',
                params: {
                    uid: uid,
                    pid: pid,
                    vistaId: account
                },
                success: function (response) {

                },
                failure: function (response) {
                }
            }
        )
    },

    startChecksumRequest: function (dfn, pid, vistaId, gridId) {
        me = this;
        me.mask();
        var gridNum = gridId;
        Ext.Ajax.request(
            {
                url: '/check/submitChecksum',
                method: "GET",
//                timeout: '500000',
                params: {
                    dfn: dfn,
                    vistaId: vistaId,
                    pid: pid

                },
                success: function (response) {
                    var json = Ext.decode(response.responseText);
                    me.checkChecksumStatus(json.requestId, gridNum)
                },
                failure: function (response) {
                }
            }
        )

    },
    checkChecksumStatus: function (request, gridId) {
        me = this;
        var req = request;
        var gridNum = gridId;
        Ext.Ajax.request(
            {
                url: '/check/checkChecksumStatus',
                method: "GET",
//                timeout: '500000',
                params: {
                    request: request
                },
                success: function (response) {
                    var json = Ext.decode(response.responseText);
                    if (json.pending) {
                        var task = new Ext.util.DelayedTask(function () {
                            me.checkChecksumStatus(req, gridNum);
                        });
                        task.delay(3000);

                    } else {
                        me.unmask();
                        if (json.error) {
                            Ext.Alert.messageBox('Error', 'Error')
                        } else {
                            if ((!gridNum) || (gridNum.length < 2)) {
                                me.vistaCrc = json.vista;
                                me.jdsCrc = json.jds;
                                me.result = json.result;
                                me.updateResults(me.vistaCrc, me.jdsCrc, me.result);
                            } else if (gridNum.length > 1) {
                                var grid = me.down('#patientsGrid');
                                var store = grid.getStore();
                                var pid = json.pid;
                                var vistaId = json.vistaId;
                                var temp = pid + ":" + vistaId;
                                var record = store.findRecord("idValue", temp);
//                                console.log(Ext.encode(json));
                                record.set("vista", json.vista);
                                record.set("jds", json.jds);
                                record.set("result", json.result);
                                record.set("same", json.same);
                            } else {
                            }
                        }
                    }
                },
                failure: function (response) {
                }
            }
        )

    },
    onGridSelect: function (grid, record, index, option) {
        var me = this
        me.updateResults(record.data.vista, record.data.jds, record.data.result);
        var btn = this.down('#jsonBtn');
        if (record.data.same == false) {
//            btn.enable(true);
            this.result = record.data.result;
            this.vistaId = record.data.vistaId;
            this.pid = record.data.pid;
        } else {
//            btn.enable(false);
            this.result = record.data.result;
            this.vistaId = '';
            this.pid = '';
        }

    },
    updateResults: function (vistaCrc, jdsCrc, compResult) {
        var vistaPanel = this.down("#sourcePanel");
        var jdsPanel = this.down("#comparePanel");
        var result = this.down("#resultPanel");
        vistaPanel.update('<pre>' + JSON.stringify(vistaCrc, null, 4) + '</pre>');
        jdsPanel.update('<pre>' + JSON.stringify(jdsCrc, null, 4) + '</pre>');
        result.update('<pre>' + JSON.stringify(compResult, null, 4) + '</pre>');
    }
});

