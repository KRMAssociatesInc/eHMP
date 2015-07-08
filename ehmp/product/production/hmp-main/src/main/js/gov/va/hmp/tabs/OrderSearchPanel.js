Ext.define('gov.va.hmp.tabs.OrderSearchPanel', {
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.ordersearchpanel',
    title: 'Orders (Search Results)',
    viewID: 'gov.va.cpe.vpr.queryeng.search.OrderSearchViewDef',
    hideHeaders: true,
    header: false,
    detailType: 'rowbody',
    detailTitleField: 'oi_name',
    detail: {actionDock: 'none', smartHeight: true},
    columns: [
        {dataIndex: 'order_start_date_time', text: 'Start', width: 125, xtype: 'healthtimecolumn'},
        {dataIndex: 'order_status_va', text: 'Status', width: 125},
        {dataIndex: 'summary', text: 'Summary', flex: 1}
    ]
});