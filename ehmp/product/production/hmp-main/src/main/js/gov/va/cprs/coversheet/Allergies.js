Ext.define('gov.va.cprs.coversheet.Allergies', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    requires: [
        'gov.va.cpe.viewdef.FacilityColumn'
    ],
    title: 'Allergies / Adverse Reactions',
    viewID: 'gov.va.cpe.vpr.queryeng.AllergiesViewDef',
    hideHeaders: true,
    detailType: 'window',
    detailTitleField: 'summary',
    detail: {
        width: 600,
        height: 400
    },
    emptyText: 'No allergies found',
    columns: [
        { text: "Allergies / Adverse Reactions", dataIndex: "summary", flex: 1 },
        { xtype: 'facilitycolumn' }
    ]
});