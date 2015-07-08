Ext.define('gov.va.cpe.OrderPanel', {
            extend: 'Ext.form.Panel',
            alias: 'widget.orderpanel',
            //id: 'snippetPanelId',
            items: [
                {
                    xtype: 'combobox',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value'],
                        data: [
                            {'value':'Inpatient Meds'},
                            {'value':'Outpatient Meds'},
                            {'value':'Non-VA Meds'},
                            {'value':'Quick Orders'}
                        ]
                    }),
                    fieldLabel: 'Order Type',
                    queryMode: 'local',
                    displayField: 'value',
                    valueField: 'value',
                    itemId: 'orderType'
                }
//                {
//                    xtype: 'combobox',
//                    store: cbtore,
//                    fieldLabel: 'Result Type',
//                    queryMode: 'local',
//                    displayField: 'value',
//                    valueField: 'value',
//                    itemId: 'resultType'
//                }
            ]
        });

