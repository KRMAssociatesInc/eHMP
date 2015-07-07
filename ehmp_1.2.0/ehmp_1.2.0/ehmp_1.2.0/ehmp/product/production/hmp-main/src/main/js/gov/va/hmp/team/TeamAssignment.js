Ext.define('gov.va.hmp.team.TeamAssignment', {
    extend:'Ext.data.Model',
    requires: [
        'gov.va.hmp.team.Person'
    ],
    fields:[
        {
            name:'positionUid',
            type:'string'
        },
        {
            name:'positionName',
            type:'string'
        },
        {
            name:'personUid',
            type:'string'
        },
        {
        	name:'boardName',
        	type:'string'
        },
        {
        	name:'boardUid',
        	type:'string'
        }
    ],
    belongsTo: 'gov.va.hmp.team.Team',
    hasOne: [
        {model: 'gov.va.hmp.team.Person', name: 'person', associationKey: 'person', foreignKey: 'personUid'}
    ]
});