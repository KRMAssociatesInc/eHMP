Ext.define('gov.va.cpe.roster.RosterSource', {
    extend: 'Ext.data.Model',
    idProperty: 'localId',
    fields: [
        'action',
        'source',
        'localId',
        'name',
        'sequence'
    ]
});