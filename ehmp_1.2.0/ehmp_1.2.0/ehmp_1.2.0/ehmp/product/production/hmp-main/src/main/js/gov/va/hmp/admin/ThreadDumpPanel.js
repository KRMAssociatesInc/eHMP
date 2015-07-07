Ext.define('gov.va.hmp.admin.ThreadDumpPanel', {
    extend: 'Ext.panel.Panel',
    title: 'Thread Dump',
    autoScroll: true,
    loader: {
        url: '/threads',
        renderer: function(loader, response, active) {
            var text = response.responseText;
            loader.getTarget().update('<pre>' + text + '</pre>');
            return true;
        }
    },
    onBoxReady:function() {
        this.callParent(arguments);

        this.getLoader().load();
    },
    autorefresh:function () {
        this.getLoader().load();
    }
});