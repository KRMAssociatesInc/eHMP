Ext.define('gov.va.cpe.order.SendPatientTimes', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'internal', type: 'string'}
    ],
    belongsTo: 'gov.va.cpe.order.DialogAdditionalInformation'
});