Ext.define('gov.va.cpe.order.OrderingPanel', {
    extend: 'Ext.panel.Panel',
    isMedOrder: false,
    isRadOrder: false,
    requires: [
        'gov.va.cpe.order.Order',
        'gov.va.cpe.order.Orderable',
        'gov.va.cpe.order.Schedule',
        'gov.va.cpe.order.Route',
        'gov.va.cpe.order.Dose',
        'gov.va.hmp.ux.InfiniteComboBox',
        'gov.va.cpe.order.Category',
        'gov.va.cpe.order.Transport',
        'gov.va.cpe.order.Modifier',
        'gov.va.cpe.order.Submit'
    ],
    alias: 'widget.orderingpanel',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'form',
            url: '/order/save',
            width: '80%',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'combobox',
                    itemId: 'typebox',
                    name: 'type',
                    editable: false,
                    fieldLabel: 'Order Type',
                    emptyText: 'Select an Order Type',
                    displayField: 'typeName',
                    valueField: 'typeName',
                    allowBlank: false,
                    forceSelection: true,
                    store: {
                        storeId: 'orderTypeStore',
                        model: 'gov.va.cpe.order.Order',
                        proxy: {
                            type: 'ajax',
                            url: '/order/types',
                            reader: {
                                type: 'json',
                                root: 'data.items',
                                totalProperty: 'data.totalItems'
                            }
                        }
                    }
                },
                {
                    xtype: 'infinitecombo',
                    itemId: 'oibox',
                    name: 'OI',
                    fieldLabel: 'Item',
                    emptyText: 'Select an Orderable Item',
                    listConfig: {
                        emptyText: 'No Orderable Items Found.'
                    },
                    disabled: true,
                    displayField: 'name',
                    valueField: 'uid',
                    allowBlank: false,
                    queryMode: 'remote',
                    minChars: 1,
                    store: {
                        storeId: 'orderOrderableStore',
                        model: 'gov.va.cpe.order.Orderable',
                        buffered: true,
                        leadingBufferZone: 200,
                        pageSize: 100,
                        purgePageCount: 0,
                        proxy: {
                            type: 'ajax',
                            url: '/order/orderables',
                            reader: {
                                type: 'json',
                                root: 'data.items',
                                totalProperty: 'data.totalItems'
                            }
                        }
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    itemId: 'medPanel',
                    layout: 'vbox',
                    defaults: {
                        flex: 2
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'dosebox',
                            name: 'dose',
                            fieldLabel: 'Dose',
                            listConfig: {
                                emptyText: 'No Dosages Found.'
                            },
                            displayField: 'dose',
                            valueField: 'dose',
                            queryMode: 'local',
                            allowBlank: false,
                            store: {
                                storeId: 'orderDoseStore',
                                model: 'gov.va.cpe.order.Dose'
                            }
                        },
                        {
                            xtype: 'combobox',
                            itemId: 'routebox',
                            fieldLabel: 'Route',
                            listConfig: {
                                emptyText: 'No Routes Found.'
                            },
                            name: 'route',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'combobox',
                            itemId: 'schedulebox',
                            name: 'schedule',
                            fieldLabel: 'Schedule',
                            listConfig: {
                                emptyText: 'No Schedules Found.'
                            },
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false,
                            queryMode: 'local',
                            store: {
                                storeId: 'orderScheduleStore',
                                model: 'gov.va.cpe.order.Schedule',
                                proxy: {
                                    type: 'ajax',
                                    url: '/order/schedules',
                                    reader: {
                                        type: 'json',
                                        root: 'data.items',
                                        totalProperty: 'data.totalItems'
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    itemId: 'radPanel',
                    layout: 'vbox',
                    width: '95%',
                    defaults: {
                        flex: 1,
                        labelAlign: 'top',
                        labelSeparator: ''
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            fieldLabel: 'Reason for Study',
                            id: "reasonStudy",
                            name: 'reasonStudy',
                            maxLength: 64,
                            minLength: 3,
                            maxLengthText: 'The Reason for Study must be between 3 and 64 characters.',
                            minLengthText: 'The Reason for Study must be between 3 and 64 characters.',
                            allowBlank: false

                        },
                        {
                            xtype: 'fieldcontainer',
//                            itemId: 'radPanel',
                            layout: 'hbox',
                            width: '95%',
                            defaults: {
                                flex: 1,
                                labelAlign: 'top',
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: "startDate1",
                                    fieldLabel: 'Date Desired',
                                    name: 'startDate',
                                    minValue: new Date()
                                },
                                {
                                    xtype: 'combobox',
                                    itemId: 'categorybox',
                                    name: 'category',
                                    fieldLabel: 'Category',
                                    listConfig: {
                                        emptyText: 'No Category Found.'
                                    },
                                    displayField: 'name',
                                    valueField: 'internal',
                                    queryMode: 'local',
                                    allowBlank: false,
                                    store: {
                                        storeId: 'orderCategoryStore',
                                        model: 'gov.va.cpe.order.Category',
                                        proxy: {
                                            type: 'memory',
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            width: '95%',
                            defaults: {
                                flex: 1,
                                labelAlign: 'top',
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    itemId: 'transportbox',
                                    name: 'transport',
                                    fieldLabel: 'Transport',
                                    listConfig: {
                                        emptyText: 'No Transport Types Found.'
                                    },
                                    displayField: 'name',
                                    valueField: 'internal',
                                    queryMode: 'local',
                                    allowBlank: false,
                                    store: {
                                        storeId: 'orderTransportStore',
                                        model: 'gov.va.cpe.order.Transport',
                                        proxy: {
                                            type: 'memory',
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    itemId: 'modifierbox',
                                    name: 'modifiers',
                                    fieldLabel: 'Modifier',
                                    listConfig: {
                                        emptyText: 'No Modifier Found.'
                                    },
                                    displayField: 'name',
                                    valueField: 'internal',
                                    queryMode: 'local',
                                    allowBlank: true,
                                    store: {
                                        storeId: 'orderModifierStore',
                                        model: 'gov.va.cpe.order.Modifier',
                                        proxy: {
                                            type: 'memory',
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            width: '95%',
                            defaults: {
                                flex: 1,
                                labelAlign: 'top',
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    itemId: 'submitbox',
                                    name: 'submit',
                                    fieldLabel: 'Submit to',
                                    listConfig: {
                                        emptyText: 'No Submit To Values Found.'
                                    },
                                    displayField: 'name',
                                    valueField: 'internal',
                                    queryMode: 'local',
                                    allowBlank: false,
                                    store: {
                                        storeId: 'orderSubmitStore',
                                        model: 'gov.va.cpe.order.Submit',
                                        proxy: {
                                            type: 'memory',
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    itemId: "preOpDate",
                                    fieldLabel: 'PreOp Scheduled',
                                    name: 'preOpDate',
                                    minValue: new Date()
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            width: '95%',
                            defaults: {
                                flex: 1,
                                labelAlign: 'top',
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    xtype: 'checkbox',
                                    itemId: 'isolation',
                                    fieldLabel: "Isolation"
                                },
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: 'Pregnant',
                                    itemId: 'pregnant',
                                    flex: 3,
                                    items: [
                                        { boxLabel: 'Yes', name: 'rb', inputValue: 'Y' },
                                        { boxLabel: 'No', name: 'rb', inputValue: '2'},
                                        { boxLabel: 'Unknown', name: 'rb', inputValue: '3' }

                                    ]

                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                    name: 'COMMENTS',
                    allowBlank: true
                },
                {
                    xtype: 'datefield',
                    id: "startDate",
                    fieldLabel: 'Start',
                    name: 'startDate',
                    maxValue: new Date()
                },
                {
                    xtype: 'fieldcontainer',
                    itemId: 'outpatientPanel',
                    layout: 'hbox',
                    defaults: {
                        flex: 1,
                        labelAlign: 'top',
                        labelSeparator: ''
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            id: 'supply',
                            name: 'supply',
                            fieldLabel: 'Days Supply',
                            value: 0,
                            maxValue: 90,
                            minValue: 0,
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            id: 'quantity',
                            name: 'quantity',
                            fieldLabel: 'Quantity',
                            value: 0,
//                                    maxValue: 90,
                            minValue: 0,
                            allowBlank: true
                        },
                        {
                            xtype: 'numberfield',
                            id: 'refill',
                            name: 'refill',
                            fieldLabel: 'Refills',
                            value: 0,
                            maxValue: 11,
                            minValue: 0,
                            allowBlank: true
                        }
                    ]
                }
            ]
        },
        {
            xtype: "panel",
//                        region: "center",
            title: "Response",
            itemId: "responsePanel",
            html: '',
            collapsed: true,
            collapsible: true
        }
    ],
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
        this.down('#routebox').store = Ext.create('Ext.data.Store', {
            storeId: 'orderRouteStore',
            model: 'gov.va.cpe.order.Route',
            proxy: {
                type: 'ajax',
                url: '/order/routes',
                reader: {
                    type: 'json',
                    root: 'data.items',
                    totalProperty: 'data.totalItems'
                }
            }
        });
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me.down('#typebox'), 'select', me.onTypeSelect, me);
        me.mon(me.down('#oibox'), 'select', me.onMedSelect, me);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        this.reset();
    },
    onTypeSelect: function (combo, records, eopts) {
        var me = this;
        var selectedType = this.down('#typebox').getValue();
        me.loadMedsForSelectedType(selectedType);
        me.updateForm();
    },
    onMedSelect: function (combo, records, eopts) {
        var me = this;
        if (records.length > 0) {
            me.loadDosagesForSelectedMed(records[0]);
        }
    },
    reset: function () {
        this.down('form').getForm().reset();
        var response = this.down('#responsePanel');
        response.update("");

        this.down('#typebox').getStore().load();
        this.down('#oibox').clearValue();
        this.down('#oibox').getStore().removeAll();
        this.down('#oibox').getStore().clearFilter();
        this.down('#oibox').setDisabled(true);
        this.down('#dosebox').clearValue();
        this.down('#dosebox').getStore().removeAll();
        this.down('#dosebox').setDisabled(true);
        this.down('#routebox').getStore().load();
        this.down('#schedulebox').getStore().load();
        this.down('#categorybox').clearValue();
        this.down('#categorybox').getStore().removeAll();
        this.down('#modifierbox').clearValue();
        this.down('#modifierbox').getStore().removeAll();
        this.down('#submitbox').clearValue();
        this.down('#submitbox').getStore().removeAll();
        this.down('#transportbox').clearValue();
        this.down('#transportbox').getStore().removeAll();
    },

    placeOrder: function () {
        var me = this;
        var form = me.down('form').getForm();
        if (form.isValid()) {
            form.submit({
                success: function (form, action) {
//                    console.log("in success");
                    var data = Ext.decode(action.response.responseText);
                    var oc = data.orderChecks;
                    var text = data.text;
//                    console.log(data);
                    var panel = me.down('#responsePanel');
                    panel.expand(true);
                    if (oc) {
//                        Ext.Msg.alert("Order Check", oc);

                        panel.update('<pre>' + 'Order Placed: \r\n' + text + '\r\n Order Checks: ' + oc + '</pre>');
                        var menu = me.up("menu");
                        var btn = menu.down('#placeOrder');
                        btn.setText('Accept OC')
                    } else {
                        panel.update('<pre>' + 'Order Placed: \r\n' + text + '</pre>');
                        var menu = me.up("menu");
                        var btn = menu.down('#placeOrder');
                        btn.setText('Done')
                    }
//                    form.reset();
//                    if (successCallback) {
//                        successCallback.call();
//                    }
                },
                failure: function (form, action) {
                    var data = Ext.decode(action.response.responseText);
                    var error = data.error.message;
                    if (error) {
                        Ext.Msg.alert("Error", error);
                        var panel = me.down('#responsePanel');
                        panel.expand(true);
                        panel.update('<html><head></head><body><pre>' + error + '</pre></body></html>');
                    }
                }
            });
        } else {
            Ext.Msg.alert("Error", 'Form is incomplete');
        }
    },

    loadMedsForSelectedType: function (selectedType) {
        if (selectedType && selectedType.length > 0) {
            var oibox = this.down('#oibox');
            oibox.clearValue();
            oibox.getStore().removeAll();
            oibox.getStore().clearFilter();
            oibox.getStore().getProxy().extraParams.type = selectedType;
            oibox.getStore().load();
        }
    },

    loadDosagesForSelectedMed: function (selectedMed) {
        var oi = this.down('#oibox');
        var selectedOi = selectedMed.getId();
//        var temp = oi.getStore().getById(selectedOi);
        if (this.isMedOrder) {
            var dosages = selectedMed.getAssociatedData().possibleDosages;
            if (!dosages) return;
            var dosebox = this.down('#dosebox');
            dosebox.setDisabled(false);
            dosebox.clearValue();
            dosebox.getStore().loadData(dosages);
        }
        if (this.isRadOrder) {
            this.loadAssociationsForSelectedRad(selectedMed);
        }
    },
    loadAssociationsForSelectedRad: function (selectedRad) {
        var radPanel = this.down('#radPanel');
        var transportbox = this.down('#transportbox');
        var categorybox = this.down('#categorybox');
        var submitbox = this.down('#submitbox');
        var modifierbox = this.down('#modifierbox');

        var dialogAdditionalInformation = selectedRad.getAssociatedData().dialogAdditionalInformation;
        var askSubmit = dialogAdditionalInformation.askSubmit;

        var transports = dialogAdditionalInformation.transports;
        if (transports) {
            transportbox.setDisabled(false);
            transportbox.clearValue();
            transportbox.getStore().loadData(transports);
        }
        var categories = dialogAdditionalInformation.categories;
        if (categories) {
            categorybox.setDisabled(false);
            categorybox.clearValue();
            categorybox.getStore().loadRawData(categories);
        }
        var submits = dialogAdditionalInformation.submitTo;
        if (submits) {
            var submitbox = this.down('#submitbox');
            submitbox.setDisabled(false);
            submitbox.clearValue();
            submitbox.getStore().loadData(submits);
            setDefaultValue(submitbox, submitbox.getStore());
        }
        var modifiers = dialogAdditionalInformation.modifiers;
        if (modifiers) {
            modifierbox.setDisabled(false);
            modifierbox.clearValue();
            modifierbox.getStore().loadData(modifiers);
        }
    },
    updateForm: function () {
        var types = this.down('#typebox');
        var typeValue = types.getValue();

        if (typeValue == 'Outpatient Meds' || typeValue == 'Inpatient Meds' || typeValue == "Non-VA Meds") {
            this.isMedOrder = true;
            this.isRadOrder = false
        }
        else {
            this.isMedOrder = false;
            this.isRadOrder = true
        }

        var oibox = this.down('#oibox');
        if (typeValue && typeValue.length > 0) {
            oibox.setDisabled(false);
        } else {
            oibox.setDisabled(true);
        }
        if (!this.isMedOrder) {
            var panel = this.down('#medPanel');
            panel.down('#dosebox').setDisabled(true);
            panel.down('#routebox').setDisabled(true);
            panel.down('#schedulebox').setDisabled(true);
            panel.hide();
        } else {
            var panel = this.down('#medPanel');
            panel.show();
            panel.down('#dosebox').setDisabled(false);
            panel.down('#routebox').setDisabled(false);
            panel.down('#schedulebox').setDisabled(false);
        }

        if (!this.isRadOrder) {
            var panel = this.down('#radPanel');
            panel.down('#reasonStudy').setDisabled(true);
            panel.down('#startDate1').setDisabled(true);
            panel.down('#transportbox').setDisabled(true);
            panel.down('#categorybox').setDisabled(true);
            panel.down('#submitbox').setDisabled(true);
            panel.down('#modifierbox').setDisabled(true);
            panel.down('#isolation').setDisabled(true);
            panel.down('#pregnant').setDisabled(true);
            panel.down('#preOpDate').setDisabled(true);
            panel.hide();
        } else {
            var panel = this.down('#radPanel');
            var patInfo = gov.va.hmp.PatientContext.getPatientInfo();
//            console.log(patInfo);

//            var gender = patGender.split(":");
//            console.log(patGender);
//            console.log(gender[3]);
            panel.show();
            panel.down('#reasonStudy').setDisabled(false);
            panel.down('#startDate1').setDisabled(false);
            panel.down('#transportbox').setDisabled(false);
            panel.down('#categorybox').setDisabled(false);
            panel.down('#submitbox').setDisabled(false);
            panel.down('#modifierbox').setDisabled(false);
            panel.down('#isolation').setDisabled(false);
            if (patInfo.gender == 'F') {
                panel.down('#pregnant').setDisabled(false);
            } else {
                panel.down('#pregnant').setDisabled(true);
            }
            panel.down('#preOpDate').setDisabled(false);
        }

        var panel = this.down('#outpatientPanel');
        var start = this.down('#startDate');
        if (typeValue != 'Outpatient Meds') {
            panel.down('#supply').setDisabled(true);
            panel.down('#quantity').setDisabled(true);
            panel.down('#refill').setDisabled(true);
            panel.hide();
        } else if (typeValue == 'Outpatient Meds') {
            panel.show();
            panel.down('#supply').setDisabled(false);
            panel.down('#quantity').setDisabled(false);
            panel.down('#refill').setDisabled(false);
        }
        if (typeValue != 'Non-VA Meds') {
            start.setDisabled(true);
            this.down('#dosebox').allowBlank = false;
            this.down('#schedulebox').allowBlank = false;
            this.down('#routebox').allowBlank = false;
            start.hide()
        } else if (typeValue == 'Non-VA Meds') {
            start.show();
            this.down('#dosebox').allowBlank = true;
            this.down('#schedulebox').allowBlank = true;
            this.down('#routebox').allowBlank = true;
            start.setDisabled(false);
        }
    }
});

function setDefaultValue(combo, store) {
    var def;
    store.each(function (record) {
        def = record.get('default');
        if (def) {
            var internal = record.get('internal');
            combo.setValue(internal);
        }
    });
}