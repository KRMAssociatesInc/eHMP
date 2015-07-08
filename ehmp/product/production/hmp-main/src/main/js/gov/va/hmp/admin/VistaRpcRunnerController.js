/**
 * Controls behavior of {@link gov.va.hmp.admin.VistaRpcRunner}
 */
Ext.define('gov.va.hmp.admin.VistaRpcRunnerController', {
    extend:'gov.va.hmp.Controller',
    // @private
    addParamButtonConfig: {
        xtype:'button',
        itemId: 'addParamButton',
        ui: 'transparent',
        padding: 0,
        cls: 'text-success',
        iconCls:'fa fa-plus-circle',
        style: {
            fontSize: '16px'
        },
        tooltip:"Add Parameter"
    },
    // @private
    removeParamButtonConfig: {
        xtype:'button',
        itemId: 'removeParamButton',
        ui: 'transparent',
        padding: 0,
        cls: 'text-danger',
        iconCls:'fa fa-minus-square',
        style: {
            fontSize: '16px'
        },
        tooltip:"Remove Parameter"
    },
    // @private
    paramTypeConfig: {
        xtype: 'combobox',
        itemId: 'paramTypeCombo',
        margin: '0 4 0 0',
        width: 86,
        editable: false,
        forceSelection: true,
        submitValue: false,
        queryMode: 'local',
        store: Ext.create('Ext.data.Store', {
            fields: ['text'],
            data: [
                {text: 'Literal'},
                {text: 'List'}
            ]
        })
    },
    // @private
    addListItemButtonConfig: {
        xtype:'button',
        itemId: 'addItemButton',
        ui: 'transparent',
        padding: 0,
        cls: 'text-info',
        iconCls:'fa fa-plus-square',
        style: {
            fontSize: '14px'
        },
        tooltip:"Add Item to List"
    },
    // @private
    removeListItemButtonConfig: {
        xtype:'button',
        itemId: 'removeItemButton',
        ui: 'transparent',
        padding: 0,
        cls: 'text-info',
        iconCls:'fa fa-minus-square',
        style: {
            fontSize: '14px'
        },
        tooltip:"Remove Item from List"
    },
    refs:[
        {
            ref:'rpcForm',
            selector:'#rpc-call > form'
        },
        {
            ref:'rpcResultPanel',
            selector:'#rpcResultPanel'
        },
        {
            ref:'rpcContext',
            selector:'#rpcContextField'
        },
        {
            ref:'rpcName',
            selector:'#rpcNameField'
        },
        {
            ref:'rpcParams',
            selector:'#rpcParametersField'
        },
        {
            ref:'rpcFormat',
            selector:'#rpcFormatField'
        }
    ],
    init:function () {
        var me = this;
        me.control({
            '#rpc-call': {
                boxready:me.onBoxReady
            },
            '#executeButton':{
                click:me.executeRpc
            },
            '#vprExtractRpcButton': {
                click:me.prepareVprExtractRpc
            },
            '#cprsRpcButton': {
                click:me.prepareCprsRpc
            },
            '#resetRpcFormButton': {
                click:me.resetRpcForm
            },
            '#deleteVprObjectRpcButton': {
                click:me.prepareDeleteVprObjectRpc
            },
            '#rpcParametersField #addParamButton': {
                click: me.onAddRpcParamClick
            },
            '#rpcParametersField #removeParamButton': {
                click: me.onRemoveRpcParamClick
            },
            '#rpcParametersField #paramTypeCombo': {
                select: me.onChangeParamType
            },
            '#rpcParametersField #addItemButton': {
                click: me.onAddItemClick
            },
            '#rpcParametersField #removeItemButton': {
                click: me.onRemoveItemClick
            }
        });
    },
    onBoxReady: function () {
        this.prepareVprExtractRpc();
    },
    onRemoveRpcParamClick:function(btn) {
        var me = this,
            params = me.getRpcParams(),
            paramCmp = btn.up('fieldcontainer');
        params.remove(paramCmp);
        if (params.items.getCount() == 0) {
            params.add(me.addParamButtonConfig);
        } else {
            me.resetParamLabels();
        }
    },
    onAddRpcParamClick: function (btn) {
        var me = this,
            params = me.getRpcParams(),
            paramCmp = btn.up('fieldcontainer');
        var index = params.items.getCount();
        if (Ext.getClassName(params.items.getAt(0)) == 'Ext.button.Button') {
            params.removeAll();
            index = 0;
        } else {
            index = params.items.indexOf(paramCmp) + 1;
        }
        me.addRpcParam(index, "Literal");
    },
    onChangeParamType:function(combo, newvalue, oldvalue) {
        var me = this,
            type = combo.getValue(),
            ct = combo.ownerCt;
            paramCmp = combo.prev();

        ct.remove(paramCmp);
        if (type == 'List') {
            ct.insert(0, {
                    xtype: 'fieldset',
                    flex: 1,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                                align: 'middle'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Subscript',
                                    submitValue: false,
                                    itemId: 'multSubscript'
                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Value',
                                    submitValue: false,
                                    itemId: 'multValue',
                                    flex: 1
                                },
                                me.removeListItemButtonConfig,
                                me.addListItemButtonConfig
                            ]
                        }
                    ]}
            );
        } else if (type == 'Literal') {
//            var i = ct.items.indexOf(combo);
            ct.insert(0, {
                xtype: 'textfield',
                name: 'params',
                allowBlank: false,
                flex: 1,
                tabIndex: 6}
            );
        }
    },
    onAddItemClick:function(btn) {
        var me = this,
            itemCt = btn.up('fieldset'),
            item = btn.up('fieldcontainer');
        var index = itemCt.items.indexOf(item) + 1;
        itemCt.insert(index, {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                {
                    xtype: 'textfield',
                    emptyText: 'Subscript',
                    submitValue: false,
                    itemId: 'multSubscript'
                },
                {
                    xtype: 'textfield',
                    emptyText: 'Value',
                    submitValue: false,
                    itemId: 'multValue',
                    flex: 1
                },
                me.removeListItemButtonConfig,
                me.addListItemButtonConfig
            ]
        });
    },
    onRemoveItemClick:function(btn) {
        var me = this;
        var item = btn.up('fieldcontainer');
        var itemsCt = item.ownerCt;
        itemsCt.remove(item);
        if (itemsCt.items.getCount() == 0) {
            itemsCt.add(me.addListItemButtonConfig);
        }
    },
    executeRpc:function() {
        var rpcResultPanel = this.getRpcResultPanel();
        var formComponent = this.getRpcForm();
//        var form = formComponent.getForm();
//        if (form.isValid()) {
            var params = this.getParams();
            rpcResultPanel.setLoading(Ext.String.format("Executing vrpcb:///{0}/{1}...", params.context, params.name), true);
            formComponent.down('button').disable();
            Ext.Ajax.request({
                url: "/rpc/execute",
                method: 'POST',
                params: params,
                success: function (response) {
                    rpcResultPanel.setLoading(false);
                    rpcResultPanel.update(response);
                },
                failure: function (response) {
                    rpcResultPanel.setLoading(false);
                    rpcResultPanel.update(response);
                }
            });
//        }
    },
    //@private
    getParams:function() {
        var formComponent = this.getRpcForm();
        var paramsCmp = this.getRpcParams();
        var params = formComponent.getValues();

        paramsCmp.items.each(function(paramCmp, paramIndex){
            var fieldset = paramCmp.down('fieldset');
            if (fieldset) {
                var paramName = 'params[' + paramIndex + ']';
                var paramValue = {};
                fieldset.items.each(function(item, index) {
                    var subscriptCmp = item.down('#multSubscript');
                    var valueCmp = item.down('#multValue');
                    var subscript = subscriptCmp.getValue();
                    var value = valueCmp.getValue();
                    paramValue[subscript] = value;
                });
                params[paramName] = Ext.JSON.encode(paramValue);
            }
        });

        return params;
    },
    prepareVprExtractRpc:function() {
        var me = this,
            form = me.getRpcForm(),
            ctx = me.getRpcContext(),
            name = me.getRpcName(),
            params = me.getRpcParams(),
            format = me.getRpcFormat(),
            rpcResultPanel = me.getRpcResultPanel();

        ctx.setValue('VPR SYNCHRONIZATION CONTEXT');
        name.setValue('VPR GET PATIENT DATA JSON');
        format.down('#json').setValue(true);
        rpcResultPanel.update('');
        params.removeAll();
        me.addRpcParam(0, "List", '0', [
            {
                subscript:'patientId'
            },
            {
                subscript:'domain',
                'enum': [
                    'accession',
                    'allergy',
                    'appointment',
                    'consult',
                    'document',
                    'factor' ,
                    'immunization',
                    'lab',
                    'med',
                    'pharmarcy',
                    'rx',
                    'order',
                    'panel',
                    'patient',
                    'problem',
                    'procedure',
                    'radiology',
                    'reaction',
                    'surgery',
                    'visit',
                    'vital',
                    'vpr'
                ]
            }
        ]);
    },
    /**
     * @private
     *
     * @param {Integer} index
     * @param {String} type
     * @param {String} [name]
     * @param {Array} [multDef]
     */
    addRpcParam:function(index, type, name, multDef) {
        var me = this,
            params = this.getRpcParams();

        if (!Ext.isDefined(name)) {
            name = index.toString();
        }
        if (type == 'Literal') {
            params.insert(index, {
                xtype: 'fieldcontainer',
                fieldLabel: name,
                items: [
                    {
                        xtype: 'textfield',
                        name: 'params',
                        flex: 1
                    },
                    Ext.apply(me.paramTypeConfig, {listeners:{boxready:function(combo) { combo.select(combo.store.data.items[0]);}}}),
                    me.removeParamButtonConfig,
                    me.addParamButtonConfig
                ]
            });
        } else if (type == 'List') {
            var items = [];
            if (Ext.isDefined(multDef)) {
                for (var i=0; i < multDef.length; i++) {
                    var valueField = {
                        xtype: 'textfield',
                        emptyText: 'Value',
                        flex: 1,
                        submitValue: false,
                        itemId: 'multValue'
                    };
                    if (Ext.isDefined(multDef[i]['enum'])) {
                        valueField = {
                            xtype: 'combobox',
                            itemId: 'multValue',
                            queryMode: 'local',
                            forceSelection: false,
                            flex: 1,
                            submitValue: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['text'],
                                data: Ext.Array.map(multDef[i]['enum'], function (x) {
                                    return {text: x};
                                })
                            })
                        }
                    }
                    items.push({
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox',
                            align: 'middle'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                emptyText: 'Subscript',
                                value: multDef[i].subscript,
                                submitValue: false,
                                itemId: 'multSubscript'
                            },
                            valueField,
                            me.removeListItemButtonConfig,
                            me.addListItemButtonConfig
                        ]
                    });
                }
            } else {
                items.push({
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            emptyText: 'Subscript',
                            submitValue: false,
                            itemId: 'multSubscript'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Value',
                            flex: 1,
                            submitValue: false,
                            itemId: 'multValue'
                        },
                        me.removeListItemButtonConfig,
                        me.addListItemButtonConfig
                    ]
                });
            }
            params.insert(index, {
                xtype: 'fieldcontainer',
                fieldLabel: name,
                items: [
                    {
                        xtype: 'fieldset',
                        name: 'params',
                        flex: 1,
                        items: items
                    },
                    Ext.apply(me.paramTypeConfig, {listeners:{boxready:function(combo) { combo.select(combo.store.data.items[1]);}}}),
                    me.removeParamButtonConfig,
                    me.addParamButtonConfig
                ]
            });
        }
        me.resetParamLabels();
    },
    prepareCprsRpc:function() {
        var me = this,
            ctx = me.getRpcContext(),
            name = me.getRpcName(),
            format = me.getRpcFormat(),
            rpcResultPanel = me.getRpcResultPanel();

        ctx.setValue('OR CPRS GUI CHART');
        format.down('#plaintext').setValue(true);
        name.setRawValue('');
        me.resetRpcParams();
        rpcResultPanel.update('');
    },
    prepareDeleteVprObjectRpc:function() {
        var me = this,
            ctx = me.getRpcContext(),
            name = me.getRpcName(),
            params = me.getRpcParams(),
            format = me.getRpcFormat(),
            rpcResultPanel = me.getRpcResultPanel();

        ctx.setValue('VPR UI CONTEXT');
        name.setValue('VPR DELETE OBJECT');
        format.down('#json').setValue(true);
        rpcResultPanel.update('');
        params.removeAll();
        me.addRpcParam(0, 'Literal', 'Object UID');
    },
    resetRpcForm: function () {
        var me = this,
            ctx = me.getRpcContext(),
            name = me.getRpcName(),
            format = me.getRpcFormat(),
            rpcResultPanel = me.getRpcResultPanel();

        ctx.setRawValue('');
        name.setRawValue('');
        format.down('#plaintext').setValue(true);
        me.resetRpcParams();
        rpcResultPanel.update('');
    },
    resetRpcParams: function () {
        var me = this,
            params = me.getRpcParams();
        params.suspendLayouts();
        params.removeAll();
        params.add(me.addParamButtonConfig);
        params.resumeLayouts(true);
    },
    resetParamLabels:function() {
        var params = this.getRpcParams();
        params.items.each(function(item, index) {
            item.setFieldLabel(index.toString());
        });
    }
});