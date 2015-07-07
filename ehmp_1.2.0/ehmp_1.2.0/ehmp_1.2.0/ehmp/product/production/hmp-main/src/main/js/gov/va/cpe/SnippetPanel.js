Ext.define('gov.va.cpe.SnippetPanel', {
            extend: 'Ext.form.Panel',
            alias: 'widget.snippetpanel',
            //id: 'snippetPanelId',
            items: [
                {
                    xtype: "textfield",
                    name: 'reason',
                    fieldLabel: 'Reason',
                    allowBlank: false,
                    itemId: 'reasonField',
                    hideEmptyLabel: false,
                    width: '100%'

                }
//                {
//                    xtype: 'combobox',
//                    store: Ext.create('Ext.data.Store', {
//                fields: ['value'],
//    data: [
//    {'value':'Problem List'},
//    {'value':'Lab Result'},
//    {'value':'Vitals'},
//    {'value':'Allergies'},
//    {'value':'Medications'}
//]
//}),
//                    fieldLabel: 'Result Type',
//                    queryMode: 'local',
//                    displayField: 'value',
//                    valueField: 'value',
//                    itemId: 'resultType'
//                }
            ]
        });

