Ext.define('gov.va.cpe.model.PointOfCareModel', {
	extend: 'Ext.data.Model',
    idProperty: 'uid',
    fields: [
        {name: 'displayName', type: 'string'},
        {name: 'description',  type: 'string'},
        {name: 'displayWhen',  type: 'string'},
        {name: 'defaultStatus',  type: 'string'},
        {name: 'inactive',  type: 'boolean'},
        {name: 'category',  type: 'string'},
        {name: 'sharedName',  type: 'string'},
        {name: 'useBoard',  type: 'string'},
        {name: 'isPrimary',  type: 'boolean'},
        {name: 'foregroundColor',  type: 'string'},
        {name: 'backgroundColor',       type: 'string'},
        {name: 'uid',  type: 'string'}
    ]
});