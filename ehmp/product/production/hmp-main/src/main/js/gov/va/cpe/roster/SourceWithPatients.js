Ext.define('gov.va.cpe.roster.SourceWithPatients', {
    extend: 'Ext.data.Model',
    idProperty: 'localId',
    fields: [
        'action',
        'source',
        'localId',
        'name',
        'patients'
    ]
});

