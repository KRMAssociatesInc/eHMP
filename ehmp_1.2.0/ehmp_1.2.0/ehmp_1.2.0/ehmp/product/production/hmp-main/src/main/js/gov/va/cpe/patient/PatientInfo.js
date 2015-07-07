Ext.define('gov.va.cpe.patient.PatientInfo', {
    extend:'Ext.window.Window',
    title:'Patient Info',
    height:200,
    id:'patientInfoWindow',
    width:200,
    closeAction:'hide',
    model:false,
    animate:true,
    easing:'easeIn',
    autoScroll:true,
    items:[
        {
            xtype:'panel',
            itemId:'patientWindowPanel',
            html:'details',
            layout:'fit',
            autoScroll:true,
            loader:{
                ajaxOptions:{
                    method:'GET'
                },
//                                params: {
//                                    format: 'html'
//                                },
                loadMask:true,
                failure:function (loader, response) {
                    loader.getTarget().update(response.responseText);
                },
                renderer:function (loader, response, active) {
                    var text = response.responseText;
                    var detail = loader.getTarget();
                    if (Ext.isFunction(detail.getDecorateFn())) {
                        text = detail.getDecorateFn().call(this, text);
                    }
                    loader.getTarget().update(text);
                },
                listeners:{
                    beforeload:function (loader) {
                        loader.getTarget().removeAll();
                        loader.getTarget().update("");
                    }
                }
            }
        }
    ]
});
