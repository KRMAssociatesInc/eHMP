Ext.define('gov.va.cpe.order.Types', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'type', type: 'string'},
        {name: 'abbreviation', type: 'string'},
        {name: 'uid', type: 'string'},
        {name: 'internal', type: 'string'}
    ],
    belongsTo: 'gov.va.cpe.order.Orderable'
});