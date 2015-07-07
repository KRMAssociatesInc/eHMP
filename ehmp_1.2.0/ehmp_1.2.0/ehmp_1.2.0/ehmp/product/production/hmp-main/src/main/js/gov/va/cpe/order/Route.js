Ext.define('gov.va.cpe.order.Route', {
	extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'uid', type: 'string'},
        {name:'summary', type: 'string'},
        {name: 'externalName', type: 'string'},
        {name: 'abbreviation', type: 'string'},
        {name: "useInIV", type: 'boolean'},
        {name: 'internal', type: 'string'}
    ]
});