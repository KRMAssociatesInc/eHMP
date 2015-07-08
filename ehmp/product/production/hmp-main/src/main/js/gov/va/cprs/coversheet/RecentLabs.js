Ext.define('gov.va.cprs.coversheet.RecentLabs', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Recent Lab Orders',
    hideHeaders: true,
    viewID: 'gov.va.cprs.ClassicRecentLabsViewDef',
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    emptyText: 'No lab orders found',
    columns: [
        { dataIndex: 'summary', flex: 1 },
        { dataIndex: 'entered', xtype: 'healthtimecolumn', format: 'DefaultDate', width: 116, align: 'right' }
    ]
});