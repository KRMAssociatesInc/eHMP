Ext.define('gov.va.cpe.order.LabDetails', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'speciman', type: 'string'},
        {name: 'labCollect', type: 'boolean'},
        {name: 'sequence', type: 'string'},
        {name: 'maxOrderFrequency', type: 'string'},
        {name: 'dailyOrderMax', type: 'string'},
        {name: 'labTypeName', type: 'string'},
        {name: 'labTypeInternal', type: 'string'}
    ],
    belongsTo: 'gov.va.cpe.order.Orderable'
});