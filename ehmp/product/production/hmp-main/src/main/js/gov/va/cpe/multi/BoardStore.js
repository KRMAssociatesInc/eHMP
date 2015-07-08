Ext.define('gov.va.cpe.multi.BoardStore', {
    extend: 'Ext.data.Store',
    requires:[
        'gov.va.cpe.multi.Board'
    ],
    storeId: 'boards',
    sortOnLoad: true,
    sorters: {property: 'name', direction: 'ASC'},
    model: 'gov.va.cpe.multi.Board',
    proxy:{
        type:'ajax',
        url:'/config/panels',
        reader:{
            type:'json',
            root:'panels'
        }
    }
});