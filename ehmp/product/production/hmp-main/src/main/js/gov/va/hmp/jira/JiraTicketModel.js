Ext.define('gov.va.hmp.jira.JiraTicketModel', {
    extend: 'Ext.data.Model',
    idProperty:'id',
    fields: [
        {name: 'id'},
        {name: 'key'},
        {name: 'fields'}
    ]
});