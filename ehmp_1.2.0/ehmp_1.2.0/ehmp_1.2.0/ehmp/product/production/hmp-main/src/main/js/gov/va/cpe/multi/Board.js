Ext.define('gov.va.cpe.multi.Board', {
    extend:'Ext.data.Model',
    requires: [
        'gov.va.cpe.multi.BoardColumn',
        'gov.va.cpe.multi.BoardCategory'
    ],
    idProperty: 'uid',
    fields:[
        {name:'uid', type:'string'},
        {name:'name', type:'string'},
        {name:'id', type:'int'},
        {name:'ownerUid', type:'string'},
        {name:'ownerName',  type:'string'},
        {name:'draft', type:'auto'},
        {name:'description', type:'string'},
        {name:'cohort', type: 'string'},
        {name:'primaryViewDefClassName', type:'string'}
    ],
    hasMany: [{
        associationKey: 'columns',
        model: 'gov.va.cpe.multi.BoardColumn',
        name: 'columns'
    },{
        associationKey: 'categories',
        model: 'gov.va.cpe.multi.BoardCategory',
        name: 'categories'
    }]
});