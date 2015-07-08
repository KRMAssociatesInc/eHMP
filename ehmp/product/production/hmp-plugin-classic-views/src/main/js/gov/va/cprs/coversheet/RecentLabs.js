Ext.define('gov.va.cprs.coversheet.RecentLabs', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Recent Lab Results',
    hideHeaders: true,
    frame: true,
    viewID: 'gov.va.cprs.ClassicRecentLabsViewDef',
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    columns: [
        { dataIndex: 'summary', flex: 1 },
        { dataIndex: 'entered', xtype: 'healthtimecolumn' }
    ]
});