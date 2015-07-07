Ext.define('gov.va.hmp.tabs.VisitSearchPanel', {
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.visitsearchpanel',
    title: 'Visits (Search Results)',
    viewID: 'gov.va.cpe.vpr.queryeng.search.VisitSearchViewDef',
    hideHeaders: true,
    header: false,
    detailType: 'rowbody',
    detailTitleField: 'location_display_name',
    detail: {actionDock: 'none', smartHeight: true},
    columns: [
        {dataIndex: 'visit_date_time', text: 'Visit Date', width: 125, xtype: 'healthtimecolumn'},
        {dataIndex: 'facility_name', text: 'Facility', width: 125},
        {dataIndex: 'patient_class_name', text: 'Class', flex: 1}
    ]
});