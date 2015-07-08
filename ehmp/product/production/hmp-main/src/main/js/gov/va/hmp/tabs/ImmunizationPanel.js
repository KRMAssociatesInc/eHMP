Ext.define('gov.va.hmp.tabs.ImmunizationPanel', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.immunizationpanel',
    title: 'Problems',
    viewID: 'gov.va.cpe.vpr.queryeng.ImmunizationsViewDef',
    detailType: 'rowbody',
    header: false,
    hideHeaders: true,
    detail: {actionDock: 'left', smartHeight: false, minHeight: 225, bodyPadding: '0 5 0 5'},
    columns: [
		{dataIndex: 'name', text: 'Immunization', flex: 1},
		{dataIndex: 'administeredDateTime', xtype: 'healthtimecolumn', text: 'Administered', width: 125},
		{xtype:'facilitycolumn'}
    ]
});