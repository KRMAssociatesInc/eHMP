Ext.define('gov.va.hmp.team.PersonStore', {
    extend: 'Ext.data.Store',
    requires:[
        'gov.va.hmp.team.Person'
    ],
    model: 'gov.va.hmp.team.Person',
    storeId: 'personStore',
    buffered: true,
    leadingBufferZone: 200,
    pageSize: 100,
    purgePageCount: 0,
    proxy: {
        type: 'ajax',
        url: '/teamMgmt/v1/person/list',
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        },
        // sends single sort as multi parameter
        simpleSortMode: true,

        // Parameter name to send filtering information in
        filterParam: 'query',
    }
});