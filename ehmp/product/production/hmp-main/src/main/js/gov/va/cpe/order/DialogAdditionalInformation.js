Ext.define('gov.va.cpe.order.DialogAdditionalInformation', {
	extend: 'Ext.data.Model',
    requires: [
        'gov.va.cpe.order.Category',
        'gov.va.cpe.order.Modifier',
        'gov.va.cpe.order.Submit',
        'gov.va.cpe.order.Transport',
        'gov.va.cpe.order.SendPatientTimes'
    ],
    fields: [
        {name: 'askSubmit', type: 'boolean'}
    ],
    belongsTo: 'gov.va.cpe.order.Orderable',
    hasMany: [
        {model: 'gov.va.cpe.order.Category', name: 'categories', associationKey: 'category'},
        {model: 'gov.va.cpe.order.Modifier', name: 'modifiers', associationKey: 'modifier'},
        {model: 'gov.va.cpe.order.Submit', name: 'submitTo', associationKey: 'submit'},
        {model: 'gov.va.cpe.order.Transport', name: 'transports', associationKey: 'transport'},
        {model: 'gov.va.cpe.order.SendPatientTimes', name: 'sendPatientTimes', associationKey: 'sendPatientTimes'}
    ]
});