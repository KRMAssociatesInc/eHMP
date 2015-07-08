Ext.define('gov.va.hmp.tabs.ProblemsPanel', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.problemspanel',
    title: 'Problems',
    viewID: 'gov.va.cpe.vpr.queryeng.ProblemViewDef',
    detailType: 'rowbody',
    header: false,
    hideHeaders: true,
    autoSelectSingleRow: true, // auto expand if only 1 row
    detail: {actionDock: 'left', smartHeight: false, minHeight: 225, bodyPadding: '0 5 0 5'},
    columns: [
		{dataIndex: 'summary', text: 'Problems', flex: 1},
		{dataIndex: 'statusName', text: 'Status', width: 75},
		{dataIndex: 'onset', xtype: 'healthtimecolumn', text: 'Onset Date', width: 100},
		{dataIndex: 'updated', xtype: 'healthtimecolumn', text: 'Date Entered', width: 75, hidden: true},
		{dataIndex: 'location', text: 'Location', hidden: true},
		{dataIndex: 'provider', text: 'Provider', hidden: true},
		{dataIndex: 'facility', text: 'Facility', hidden: true},
		{dataIndex: 'acuity', text: 'Acuity', hidden: true},
		{dataIndex: 'icdCode', text: 'Icd Code', hidden: true}
    ]
});