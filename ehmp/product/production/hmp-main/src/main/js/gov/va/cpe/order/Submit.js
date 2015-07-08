Ext.define('gov.va.cpe.order.Submit', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'uid', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'default', type: 'boolean'},
        {name: 'internal', type: 'string'}
    ],
    belongsTo: 'gov.va.cpe.order.DialogAdditionalInformation'
});