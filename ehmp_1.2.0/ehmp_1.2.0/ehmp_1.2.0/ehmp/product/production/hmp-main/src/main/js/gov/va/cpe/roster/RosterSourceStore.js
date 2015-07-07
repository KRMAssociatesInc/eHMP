Ext.define('gov.va.cpe.roster.RosterSourceStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.cpe.roster.RosterSource'
    ],
    storeId: 'rostersources',
    model: 'gov.va.cpe.roster.RosterSource',
    pageSize: 50,
    sortOnLoad: true,
    sorters: {property: 'name', direction: 'ASC'},
    proxy: {
        type: 'ajax',
        url: '/roster/source',
        extraParams: {
            id:'all',
            filter:''
        },
        reader: {
            root: 'data.items',
            totalProperty: 'data.totalItems',
            type: 'json'
        }
    }
});