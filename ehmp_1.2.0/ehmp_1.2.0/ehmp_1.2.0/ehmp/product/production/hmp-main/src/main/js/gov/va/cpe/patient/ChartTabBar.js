Ext.define('gov.va.cpe.patient.ChartTabBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.charttabbar',
    cls: 'hmp-chart-tabs-toolbar',
    initComponent:function() {
        var me = this;

        me.callParent(arguments);

        me.layout.overflowHandler = new Ext.layout.container.boxOverflow.Scroller(me.layout);
    },
    onRender:function() {
        var me = this;
        me.callParent(arguments);
        me.el.appendChild({tag: 'div', cls:'hmp-chart-tabs-strip'});
    }
});