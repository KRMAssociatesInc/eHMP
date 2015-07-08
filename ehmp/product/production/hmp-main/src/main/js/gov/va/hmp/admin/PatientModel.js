Ext.define('gov.va.hmp.admin.PatientModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'pid', type: 'string'},
        {name: 'dfn', type: 'string'}
    ]
});