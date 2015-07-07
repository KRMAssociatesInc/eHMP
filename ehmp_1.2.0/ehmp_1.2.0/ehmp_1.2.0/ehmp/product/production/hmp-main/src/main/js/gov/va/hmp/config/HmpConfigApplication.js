Ext.define('gov.va.hmp.config.HmpConfigApplication', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.config.PageBuilder'
    ],
    launch:function() {
        Ext.create('gov.va.hmp.Viewport', {
            items: [
                {
                    xtype: 'tabpanel',
                    region: 'center',
                    padding: 10,
                    bodyPadding: '6 0 0 0',
                    items: [
                        {
                            xtype:'pagebuilder',
                            title: 'Configure Pages'
                        },
                        {
                            xtype: 'component',
                            title: 'Configure Menus'
                        }
                    ]
                }
            ]
        });
    }
});