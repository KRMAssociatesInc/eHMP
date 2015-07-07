Ext.define('gov.va.cprs.coversheet.Reminders', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    title: 'Clinical Reminders',
    viewID: 'gov.va.cprs.CprsClassicRemindersViewDef',
    itemId: 'clinicalReminders',
    hideHeaders: true,
    viewParams: {
//                        filter_dfn: gov.va.hmp.PatientContext.getPatientInfo().localId,
//                        filter_user: gov.va.hmp.UserContext.getUserInfo().duz,
        filter_location: 240

    },
    columns: [
        { text: "Description", dataIndex: "name", flex: 1},
        { text: "Due Date", dataIndex: "status"}
    ]
});