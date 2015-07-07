Ext.define('gov.va.cprs.Notes', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn'
    ],
    alias: 'widget.classicnotestab',
    title: 'Notes',
    height: '100%',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
        	xtype: 'viewdefgridpanel',
            flex: 1,
            viewID: 'gov.va.cprs.CprsClassicNotesViewDef',
            addFilterTool: true,
            title: 'Notes',
            detailTitleTpl: '{localTitle}',
            detailType: 'right',
            detail: {
                frame: true,
                width: '50%'
            },
            columns: [
                {text: 'Date/Time', xtype: 'healthtimecolumn', dataIndex: 'dateTime'},
                {text:'Title', flex: 1, dataIndex:'summary'},
                {text: 'Type', dataIndex: 'kind'},
                {text: 'Author', dataIndex: 'authorDisplayName'},
                {xtype: 'facilitycolumn'}
            ]
        }
    ]
});