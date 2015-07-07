Ext.define('gov.va.cprs.coversheet.ActiveMedications', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Active Medications',
    flex: 1,
    emptyText: 'No active medications found',
    viewID: 'gov.va.cpe.vpr.queryeng.MedsViewDef',
    viewParams: {
        qfilter_status: ['ACTIVE', 'PENDING'],
        spanTime: 'T-120..T'
    },
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    hideHeaders: true,
    columns: [
        { xtype: 'templatecolumn', flex: 1, tpl:'{[values.products[0].ingredientName]} {[values.dosages[0].dose]} {[values.dosages[0].routeName]} {[values.dosages[0].scheduleName]}'},
        { dataIndex: "vaStatus", width: 60, align: 'right'}
    ]
});