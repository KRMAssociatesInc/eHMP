Ext.define('gov.va.cpe.multi.BoardBuilderApp', {
    extend:'gov.va.hmp.Application',
    requires:[
        'gov.va.hmp.Viewport',
        'gov.va.cpe.multi.BoardBuilderController'
    ],
    launch:function () {
        Ext.create('gov.va.hmp.Viewport', {
            items:[
                {
                    xtype:'panelEditor',
                    region:'center'
                }
            ]
        });
    },
	controllers:[
	    'gov.va.cpe.multi.BoardBuilderController'
	]
});