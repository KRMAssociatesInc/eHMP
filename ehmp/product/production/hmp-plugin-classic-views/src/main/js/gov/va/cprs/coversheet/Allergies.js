Ext.define('gov.va.cprs.coversheet.Allergies', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Allergies / Adverse Reactions',
    viewID: 'gov.va.cpe.vpr.queryeng.AllergiesViewDef',
    frame: true,
    hideHeaders: true,
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    columns: [
        { text: "Allergies / Adverse Reactions", dataIndex: "summary", flex: 1 }
    ]
});