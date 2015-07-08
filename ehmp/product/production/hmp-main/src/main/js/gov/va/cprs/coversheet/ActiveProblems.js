Ext.define('gov.va.cprs.coversheet.ActiveProblems', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Active Problems',
    viewID: 'gov.va.cprs.ClassicProblemsViewDef',
    viewParams: {
        filterView: 'active'
    },
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    emptyText: 'No problems found',
    hideHeaders: true,
    columns: [
        {
            xtype: 'templatecolumn',
            tpl: "<tpl if='acuityCode == \"urn:va:prob-acuity:a\"'>&nbsp;*<tpl else>&nbsp;&nbsp;</tpl>{summary}",
            flex: 1
        },
        {
            xtype: 'facilitycolumn'
        }
    ]
});