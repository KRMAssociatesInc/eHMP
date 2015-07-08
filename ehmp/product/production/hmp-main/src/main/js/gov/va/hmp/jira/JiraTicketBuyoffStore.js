Ext.define('gov.va.hmp.jira.JiraTicketBuyoffStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.hmp.jira.JiraTicketModel'
    ],
    storeId: 'jiratickets',
    model: 'gov.va.hmp.jira.JiraTicketModel',
    pageSize: 250,
    sortOnLoad: true,
    sorters: {property: 'key', direction: 'ASC'},
    proxy: {
        type: 'ajax',
        url: '/jira/buyoff'
    }
});