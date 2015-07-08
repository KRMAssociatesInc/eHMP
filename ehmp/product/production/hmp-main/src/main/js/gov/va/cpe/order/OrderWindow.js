Ext.define('gov.va.cpe.order.OrderWindow', {
    extend:'Ext.window.Window',
    requires: ['gov.va.cpe.viewdef.editors.PointOfCareEditor'],
    title:'Create an Order',
    height:400,
    id:'orderWindow',
    width:400,
    layout:{
        type:'fit'
    },
    items:[
        {
            xtype: 'orderingpanel'
        }
    ]
});
