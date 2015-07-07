Ext.define('gov.va.hmp.team.TeamCategoryStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.hmp.team.TeamCategory'
    ],
    storeId: 'teamCategories',
    model:'gov.va.hmp.team.TeamCategory',
    sorters: ['name'],
    proxy: {
        type: 'ajax',
        url: '/category/list',
        extraParams: {
        	domain: 'team'
        },
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    }
});