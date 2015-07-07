Ext.define('gov.va.hmp.auth.Initializing', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.Viewport',
        'gov.va.hmp.AppContext',
        'gov.va.hmp.auth.InitializingController',
        'gov.va.hmp.ux.ClearButton'
    ],
    autoListenForBroadcastEvents: false,
    controllers: [
        'gov.va.hmp.auth.InitializingController'
    ],
    launch: function () {
        Ext.create('gov.va.hmp.Viewport', {
            itemId: 'hmpInitializingViewport',
            items: [
                {
                    xtype: 'container',
                    region: 'center',
                    padding: '6 0 0 0',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'image',
                            src: '/images/hmp_logo_straight.png',
                            height: 87,
                            width: 600
                        },
                        {
                            xtype: 'component',
                            autoEl: 'p',
                            cls: 'muted',
                            style: {
                                'font-size': '14px'
                            },
                            html: gov.va.hmp.AppContext.getVersion()
                        },
                        {
                            xtype: 'component',
                            autoEl: 'p',
                            cls: 'muted',
                            style: {
                                'font-size': '14px'
                            }
                        },
                        {
                            xtype: 'component',
                            itemId: 'welcomeArea',
                            autoEl: 'pre',
                            height: 260,
                            width: 680,
                            border: 1,
                            style: {
                                'font-size': '14px'
                            },
                            overflowY: 'scroll',
                            loader: {
                                url: '/auth/welcome',
                                method: 'post',
                                loadMask: true,
                                renderer: function (loader, response, active) {
                                    var text = response.responseText;
                                    loader.getTarget().update(text);
                                    return true;
                                }
                            }
                        },
                        {
                            xtype: 'container',
                            itemId: 'syncStatusProgressArea',
                            layout: {
                                type: 'vbox',
                                align: 'center'
                            },
                            items: [{
                                xtype: 'component',
                                html: '<h4>Initializing System</h4>'
                            }]
                        }
                    ]
                }
            ]
        });
    }
});