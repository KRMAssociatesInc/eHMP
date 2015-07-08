Ext.define('gov.va.cpe.order.Modifier', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'uid', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'internal', type: 'string'}
    ],
    belongsTo: 'gov.va.cpe.order.DialogAdditionalInformation'
});