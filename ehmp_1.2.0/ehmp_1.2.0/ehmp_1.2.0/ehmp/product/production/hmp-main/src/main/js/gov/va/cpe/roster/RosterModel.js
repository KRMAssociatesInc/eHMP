Ext.define('gov.va.cpe.roster.RosterModel', {
    extend: 'Ext.data.Model',
    requires: [
        'gov.va.hmp.ptselect.PatientSelect',
        'gov.va.cpe.roster.RosterSource'
    ],
    idProperty:'uid',
    fields: [
        {name: 'uid'},
        {name: 'localId'},
        {name: 'name'},
        {name: 'ownerUid'},
        {name: 'owner'},
        {name: 'favorite'},
        {name: 'panel'},
        {name: 'viewdef', defaultValue: 'gov.va.cpe.vpr.queryeng.RosterViewDef'}
    ],
    hasMany: [
        {
            associationKey: 'patients',
            model: 'gov.va.hmp.ptselect.PatientSelect',
            name: 'patients'
        },
        {
        	associationKey: 'sources',
        	model: 'gov.va.cpe.roster.RosterSource',
        	name: 'sources'
        }
    ]
});