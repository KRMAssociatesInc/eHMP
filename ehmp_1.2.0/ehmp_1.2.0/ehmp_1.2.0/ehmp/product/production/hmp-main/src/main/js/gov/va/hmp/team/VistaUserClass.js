Ext.define('gov.va.hmp.team.VistaUserClass', {
    extend:'Ext.data.Model',
    fields:[
        "uid",
        "displayName",
        "name",
        "abbreviation",
        {name:"status",type:'string'},
        {name:'inactive', type:'boolean', convert: function(v,record) { return record.data.status === 'Inactive'}},
        {name:"personClass",type:'string'},
        {name:"okToDistribute", type:'boolean'},
        {name:'private', type:'boolean', convert: function(v,record) { return record.data.okToDistribute === false}}
    ],
    hasMany:{
        model:'gov.va.hmp.team.VistaUserClass',
        name:'subclasses'
    }
});