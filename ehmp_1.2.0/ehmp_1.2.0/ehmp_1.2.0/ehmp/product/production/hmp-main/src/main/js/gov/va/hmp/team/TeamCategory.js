Ext.define('gov.va.hmp.team.TeamCategory', {
    extend:'Ext.data.Model',
    idProperty: 'uid',
    fields:[
        {
            name:'uid',
            type:'string'
        },
        {
            name:'name',
            type:'string'
//            convert:function (value, record) {
//                return value.replace(/ /g, '\xA0');
//            }
        },
        {
            name:'description',
            type:'string'
        },
        {
            name:'domain',
            type:'string'
        }
    ],
    belongsTo: 'gov.va.hmp.team.Team'
});