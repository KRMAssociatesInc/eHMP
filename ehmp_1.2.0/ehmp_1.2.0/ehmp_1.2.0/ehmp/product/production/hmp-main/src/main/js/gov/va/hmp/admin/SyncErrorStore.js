Ext.define('gov.va.hmp.admin.SyncErrorStore', {
    extend:'Ext.data.Store',
    storeId:'syncErrors',
    fields:['id', 'patient', 'pids', 'dateCreated', 'item', 'message', 'stackTrace', 'json'],
    pageSize: 20,
    proxy : {
        type: 'ajax',
        url : '/sync/syncErrors',
        extraParams: {
            format: 'json',
            includeWarnings: 'false'
        },
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    }
});