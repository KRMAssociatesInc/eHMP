Ext.define('gov.va.hmp.tabs.DocumentsPanel', {
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
    alias: 'widget.documentspanel',
    title: 'Merged Docs',
    detailType: 'right',
    padding: '0 5',
    items: [
        {
            xtype: 'viewdefgridpanel',
            ui: 'underlined-title-condensed',
            flex: 2,
            viewID: 'gov.va.cpe.vpr.queryeng.MergedDocumentsViewDef',
            detailTitleTpl: '{localTitle}',
            scroll: true,
            columns: [
                { text: 'Title', dataIndex: 'summary', flex: 1, minWidth: 200, renderer: function(value) {return '<span title="'+value+'">'+value+'</span>';} },
                { text: 'Date/Time', xtype: 'healthtimecolumn', dataIndex: 'dateTime' },
                { text: 'Type', dataIndex: 'kind' },
                { text: 'Author', dataIndex: 'authorDisplayName' },
                { xtype: 'facilitycolumn' }
            ]
        }
    ]
});