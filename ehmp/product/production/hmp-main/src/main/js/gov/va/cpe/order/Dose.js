Ext.define('gov.va.cpe.order.Dose', {
	extend: 'Ext.data.Model',
    idProperty: 'dose',
    fields: [
        {name: 'dose', type: 'String'},
        {name: 'size', type: 'String'},
        {name: 'drugName', type: 'String'},
        {name: 'drugUid', type: 'String'},
        {name: 'drugInternal', type: 'string'}
    ]
});