Ext.define('gov.va.cprs.coversheet.ActiveMedications', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Active Medications',
    flex: 1,
    emptyText: 'No active medications found',
    viewID: 'gov.va.cpe.vpr.queryeng.MedsViewDef',
    viewParams: {
        qfilter_status: ['ACTIVE', 'PENDING']
    },
    frame: true,
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    hideHeaders: true,
    columns: [
        { dataIndex: "summary", flex: 1},
        { dataIndex: "vaStatus"}
    ]
});