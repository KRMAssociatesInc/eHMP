Ext.define('gov.va.cpe.PatEdWin', {
    extend: 'Ext.window.Window',
    requires: ['gov.va.hmp.tabs.InfobuttonSearchPanel'],
    title: 'Patient Education Topics',
    closeable: true,
    id: 'patEdWin',
    height: 450,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'hide',
    fbar: [
        '->',
        {
            xtype: 'button',
            text: 'Close',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ],
    initComponent: function () {
    	var me = this;
        this.callParent(arguments);
        
        // pass any viewParams on to the viewdef
        var params = this.viewParams || {};
        this.panel = this.add({xtype: 'infobuttonsearchpanel', viewParams: params});
        
        // when changing patient context, auto-close this window
        gov.va.hmp.EventBus.on('beforepatientselectconfirmed', this.close, this);
    }
});
