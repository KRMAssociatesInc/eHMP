Ext.define('gov.va.cpe.order.ImagingDetails', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'commonProcedure', type: 'boolean'},
        {name: 'contractMedia', type: 'string'},
        {name: 'procedureType', type: 'string'}
    ],
    belongsTo: 'gov.va.cpe.order.Orderable'
});