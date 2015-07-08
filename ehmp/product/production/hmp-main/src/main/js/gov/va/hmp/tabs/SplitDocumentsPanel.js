Ext.define('gov.va.hmp.tabs.SplitDocumentsPanel', {
    extend: 'gov.va.hmp.containers.MultiGridPanel',
    requires: [
        'gov.va.hmp.healthtime.PointInTime',
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn',
        'gov.va.cpe.patient.PatientAwareTab'
    ],
    mixins: {
        patientawaretab: 'gov.va.cpe.patient.PatientAwareTab'
    },
    alias: 'widget.splitdocumentspanel',
    title: 'Split Docs',
    padding: '0 5',
    // TODO: change the detail???
    detail: {
        width: 575,
        margin: '0 0 0 5'
    },
    items: [
        {
            xtype: 'viewdefgridpanel',
            ui: 'underlined-title-condensed',
            flex: 2,
            viewID: 'gov.va.cpe.vpr.queryeng.StudiesViewDef',
            addFilterTool: true,
            title: 'Studies and Surgeries',
            detailTitleTpl: '{localTitle}',
            scroll: true,
            columns: [
                { text: 'Title', dataIndex: 'summary', flex: 1 },
                { text: 'Date/Time', xtype: 'healthtimecolumn', dataIndex: 'dateTime' },
                { text: 'Type', dataIndex: 'kind' },
                { text: 'Author', dataIndex: 'authorDisplayName' },
                { xtype: 'facilitycolumn' }
            ]
        },
        { xtype: 'tbspacer', height: 5},
        {
            xtype: 'viewdefgridpanel',
            ui: 'underlined-title-condensed',
            flex: 2,
            viewID: 'gov.va.cpe.vpr.queryeng.NotesViewDef',
            addFilterTool: true,
            title: 'Notes and Consults',
            detailTitleTpl: '{Summary}',
            scroll: true,
            columns: [
                { text: 'Title', dataIndex: 'summary', flex: 1 },
                { text: 'Date/Time', xtype: 'healthtimecolumn', dataIndex: 'dateTime' },
                { text: 'Type', dataIndex: 'kind' },
                { text: 'Author', dataIndex: 'authorDisplayName' },
                { xtype: 'facilitycolumn' }
            ]
        }
    ]
});