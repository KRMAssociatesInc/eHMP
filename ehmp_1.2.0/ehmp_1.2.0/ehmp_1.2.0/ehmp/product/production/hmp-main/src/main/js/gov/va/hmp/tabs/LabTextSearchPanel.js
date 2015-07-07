Ext.define('gov.va.hmp.tabs.LabTextSearchPanel', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    requires: [
        'gov.va.hmp.healthtime.PointInTime'
    ],
    alias: 'widget.labtextsearchpanel',
    title: 'Labs (Search Results)',
    viewID: 'gov.va.cpe.vpr.queryeng.search.LabTextSearchViewDef',
    hideHeaders: true,
    header: false,
    height:"auto",
    detailType: 'rowbody',
    detailTitleField: 'local_title',
    detail: {actionDock: 'none', smartHeight: true, extraParams: {}, collapsible: false, collapsed: false},
    columns: [
        {dataIndex: 'observed', text: 'Collected', width: 125, xtype: 'healthtimecolumn'},
        {dataIndex: 'display_name', text: 'Name', flex: 1}
    ]
});