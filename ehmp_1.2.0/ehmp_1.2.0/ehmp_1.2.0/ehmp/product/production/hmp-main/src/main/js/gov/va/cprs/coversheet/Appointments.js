Ext.define('gov.va.cprs.coversheet.Appointments', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Appointments/Visits/Admissions',
    hideHeaders: true,
    viewID: 'gov.va.cprs.ClassicCoverVisitViewDef',
    viewParams: {
        range: "t-180..t+120"
//                        filter_stop: '20130530'
    },
    detailType: 'window',
    detailTitleField: 'typeDisplayName',
    detail: {
        width: 600,
        height: 400
    },
    columns: [
        { xtype: 'healthtimecolumn', dataIndex: 'dateTime', width: 120},
        { text: "Description", dataIndex: "locationDisplayName", flex: 1}
//                        { text: "Due Date", dataIndex: "status"}
    ]
});