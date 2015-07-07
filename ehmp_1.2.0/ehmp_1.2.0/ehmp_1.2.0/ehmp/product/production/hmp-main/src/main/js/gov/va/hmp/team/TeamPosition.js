Ext.define('gov.va.hmp.team.TeamPosition', {
    extend:'Ext.data.Model',
    idProperty: 'uid',
    fields:[
        {
            name:'uid',
            type:'string'
        },
        {
            name:'name',
            type:'string',
            convert:function (value, record) {
                return value.replace(/ /g, '\xA0');
            }
        },
        {
            name:'description',
            type:'string'
//            convert:function (value, record) {
//                return value.replace(/ /g, '\xA0');
//            }
        }
    ]
});