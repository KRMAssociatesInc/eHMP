Ext.define('gov.va.hmp.team.TeamPositionStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.hmp.team.TeamPosition'
    ],
    storeId: 'teamPositions',
    model:'gov.va.hmp.team.TeamPosition',
    sorters: ['name'],
    proxy: {
        type: 'ajax',
        url: '/teamMgmt/v1/position/list',
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    }
});