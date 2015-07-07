Ext.define('gov.va.hmp.team.TeamStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.hmp.team.Team'
    ],
    storeId: 'teams',
    model: 'gov.va.hmp.team.Team',
    sortOnLoad: true,
    sorters: {property: 'displayName', direction: 'ASC'},
    proxy: {
        type: 'ajax',
        url: '/teamMgmt/v1/team/list',
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    },
    autoLoad: true
});