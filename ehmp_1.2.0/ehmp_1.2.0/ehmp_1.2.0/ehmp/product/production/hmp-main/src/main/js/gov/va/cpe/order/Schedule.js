Ext.define('gov.va.cpe.order.Schedule', {
	extend: 'Ext.data.Model',
    idProperty:'uid',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'uid', type: 'string'},
        {name:'externalValue', type: 'string'},
        {name:'scheduleType', type: 'string'},
        {name:'summary', type: 'string'},
        {name: 'internal', type: 'string'}
    ]
});