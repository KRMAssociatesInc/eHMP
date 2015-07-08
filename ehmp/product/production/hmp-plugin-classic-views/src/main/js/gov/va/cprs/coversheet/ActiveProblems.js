Ext.define('gov.va.cprs.coversheet.ActiveProblems', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Active Problems',
    viewID: 'gov.va.cprs.ClassicProblemsViewDef',
    viewParams: {
        filter_status: 'urn:va:sct:5561003'
    },
    frame: true,
//                    detail: 'problem',
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    hideHeaders: true,
    columns: [
        {
            xtype: 'templatecolumn',
            tpl: "<tpl if='acuityCode == \"urn:va:prob-acuity:a\"'>&nbsp;*<tpl else>&nbsp;&nbsp;</tpl>{summary}",
            flex: 1
        }
    ]
});