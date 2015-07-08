Ext.define('gov.va.cpe.viewdef.CWDFTypeProfileDocsViewDef', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.cwdftypeprofiledocsviewdef',
    viewParams: { profile_doc_type: 'cwdf' },
    autoScroll: true,
    hideHeaders: false,
    viewID: 'gov.va.cpe.vpr.queryeng.ProfileDocsViewDef',
    detailType: 'rowbody',
    //collapsible: true,

    columns: [
        {
            text: 'Crisis Notes, Warning Notes, Directives',
            dataIndex: 'kind',
            flex: 1
        },
        {
            text: '&nbsp;',
            dataIndex: 'dateTime',
            flex:1,
            renderer: function(value) {
                return PointInTime.format(value, Ext.Date.patterns.CPRSDate);
            }

        }
    ]
});