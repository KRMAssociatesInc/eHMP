Ext.define('gov.va.hmp.auth.VistaAccountsStore', {
    extend: 'Ext.data.Store',
    storeId: 'vistaAccountsStore',
    fields: ['name', 'vistaId', 'division', 'host', 'port'],
    proxy: {
        type: 'ajax',
        url: "accounts",
        extraParams: {
            format: 'json'
        },
        reader: {
            type: 'json',
            root: 'data.items'
        }
    }
});
