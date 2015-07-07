Ext.define('gov.va.cpe.LoggedInUserStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.cpe.LoggedInUserModel'
    ],
    model: 'gov.va.cpe.LoggedInUserModel',
    proxy: {
        type: 'ajax',
        url: '/chat/users',
        reader: {
            root: 'data',
            type: 'json'
        }
    },
    listeners: {
        load: function(store, recs, success, opts) {
            Ext.log('Records length: '+recs.length);
        }
    }
});

