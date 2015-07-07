Ext.define('gov.va.hmp.auth.DataStreamError', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.Viewport',
        'gov.va.hmp.AppContext',
        'gov.va.hmp.ux.ClearButton',
        'gov.va.hmp.auth.SystemUnavailable'
    ],
    autoListenForBroadcastEvents: false,
    launch: function () {
        var me = this;
        Ext.create('gov.va.hmp.auth.SystemUnavailable', {
            itemId: 'hmpDataStreamErrorViewport',
            addlItems: [{
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [{
                    xtype: 'component',
                    cls: 'text-danger',
                    html: '<h4>Fatal error in integration between HMP and VistA: HMP has been disabled for safety.</h4><p>' + me.disabledMsg + '</p>'
                }]
            }]
        });
    }
});