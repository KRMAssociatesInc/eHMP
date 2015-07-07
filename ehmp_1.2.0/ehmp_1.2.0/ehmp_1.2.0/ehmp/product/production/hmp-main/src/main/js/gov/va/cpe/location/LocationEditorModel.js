Ext.define('gov.va.cpe.location.LocationEditorModel', {
	extend: 'Ext.data.Model',
    fields:[
        {name:'displayName', type:'string'},
        {name:'displayWhen', type:'string'},
        {name:'defaultStatus', type:'string'},
        {name:'inactive', type:'boolean'},
        {name:'category', type:'string'},
        {name:'sharedName', type:'string'},
        {name:'useBoard', type:'string'},
        {name:'isPrimary', type:'boolean'},
        {name:'useColor', type:'boolean'},
        {name:'foregroundColor', type:'string'},
        {name:'backgroundColor', type:'string'},
        {name:'id', type:'int'}
    ]
});